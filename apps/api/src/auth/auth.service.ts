import { ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser, RequestMetadata } from './auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterDto, metadata: RequestMetadata) {
    const email = input.email.trim().toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email }, select: { id: true } })) {
      throw new ConflictException('An account with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await hash(input.password, 12),
        fullName: input.fullName.trim(),
        cityOrigin: input.cityOrigin.trim(),
        ...this.nameParts(input.fullName),
      },
      select: { id: true, email: true, phoneNumber: true, platformRole: true, fullName: true, cityOrigin: true },
    });
    return { user, ...(await this.createSession(user, metadata)) };
  }

  async login(input: LoginDto, metadata: RequestMetadata) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
      select: { id: true, email: true, phoneNumber: true, platformRole: true, fullName: true, cityOrigin: true, passwordHash: true },
    });
    if (!user?.passwordHash || !(await compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return { user: safeUser, ...(await this.createSession(user, metadata)) };
  }

  async federatedLogin(idToken: string, metadata: RequestMetadata) {
    const firebaseUser = await this.verifyFirebaseToken(idToken);
    const email = firebaseUser.email?.trim().toLowerCase() || null;
    const phoneNumber = firebaseUser.phoneNumber || null;

    let user = await this.prisma.user.findUnique({ where: { externalAuthId: firebaseUser.localId } });
    if (!user && email && firebaseUser.emailVerified) user = await this.prisma.user.findUnique({ where: { email } });
    if (!user && phoneNumber) user = await this.prisma.user.findUnique({ where: { phoneNumber } });

    if (user && user.externalAuthId && user.externalAuthId !== firebaseUser.localId) {
      throw new ConflictException('This account is already linked to another sign-in identity');
    }

    user = user
      ? await this.prisma.user.update({
          where: { id: user.id },
          data: {
            externalAuthId: firebaseUser.localId,
            email: user.email ?? email,
            phoneNumber: user.phoneNumber ?? phoneNumber,
            emailVerifiedAt: user.emailVerifiedAt ?? (firebaseUser.emailVerified ? new Date() : null),
          },
        })
      : await this.prisma.user.create({
          data: {
            externalAuthId: firebaseUser.localId,
            email,
            phoneNumber,
            emailVerifiedAt: firebaseUser.emailVerified ? new Date() : null,
          },
        });

    const safeUser = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      platformRole: user.platformRole,
      fullName: user.fullName,
      cityOrigin: user.cityOrigin,
    };
    return {
      user: safeUser,
      profileComplete: Boolean(user.fullName && user.cityOrigin),
      ...(await this.createSession(safeUser, metadata)),
    };
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: input.fullName.trim(),
        cityOrigin: input.cityOrigin.trim(),
        ...this.nameParts(input.fullName),
      },
      select: { id: true, email: true, phoneNumber: true, fullName: true, cityOrigin: true, platformRole: true },
    });
  }

  async refresh(rawToken: string | undefined, metadata: RequestMetadata) {
    const parsed = this.parseRefreshToken(rawToken);
    const current = await this.prisma.authSession.findUnique({
      where: { id: parsed.sessionId },
      include: { user: { select: { id: true, email: true, phoneNumber: true, platformRole: true, fullName: true, cityOrigin: true } } },
    });
    if (!current || current.revokedAt || current.expiresAt <= new Date() || !this.matchesToken(current.tokenHash, parsed.secret)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.authSession.update({ where: { id: current.id }, data: { revokedAt: new Date() } });
    return { user: current.user, ...(await this.createSession(current.user, metadata)) };
  }

  async logout(rawToken: string | undefined) {
    if (!rawToken) return;
    const sessionId = rawToken.split('.', 1)[0];
    if (sessionId) {
      await this.prisma.authSession.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date() } });
    }
  }

  private async createSession(user: AuthUser, metadata: RequestMetadata) {
    const secret = randomBytes(32).toString('base64url');
    const session = await this.prisma.authSession.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(secret),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent?.slice(0, 500),
      },
      select: { id: true, expiresAt: true },
    });
    const accessToken = await this.jwt.signAsync(
      { email: user.email, platformRole: user.platformRole },
      { subject: user.id, secret: this.getJwtSecret(), expiresIn: ACCESS_TOKEN_TTL_SECONDS },
    );
    return { accessToken, refreshToken: `${session.id}.${secret}`, refreshExpiresAt: session.expiresAt };
  }

  private async verifyFirebaseToken(idToken: string) {
    const apiKey = this.config.get<string>('FIREBASE_WEB_API_KEY');
    if (!apiKey) throw new ServiceUnavailableException('Google, Facebook, and mobile sign-in are not configured');
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok) throw new UnauthorizedException('External sign-in could not be verified');
    const payload = (await response.json()) as {
      users?: Array<{ localId: string; email?: string; emailVerified?: boolean; phoneNumber?: string }>;
    };
    const user = payload.users?.[0];
    if (!user?.localId) throw new UnauthorizedException('External sign-in could not be verified');
    return user;
  }

  private nameParts(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') || null };
  }

  private parseRefreshToken(rawToken: string | undefined) {
    const [sessionId, secret] = rawToken?.split('.') ?? [];
    if (!sessionId || !secret) throw new UnauthorizedException('Invalid refresh token');
    return { sessionId, secret };
  }

  private matchesToken(expectedHash: string, token: string) {
    const actual = Buffer.from(this.hashToken(token), 'hex');
    const expected = Buffer.from(expectedHash, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private getJwtSecret() {
    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    if (!secret || secret.length < 32) throw new Error('JWT_ACCESS_SECRET must contain at least 32 characters');
    return secret;
  }
}
