import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import type { AuthUser } from './auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest & { authUser?: AuthUser }>();
    const bearer = request.headers.authorization?.startsWith('Bearer ')
      ? request.headers.authorization.slice(7)
      : undefined;
    const token = bearer ?? request.cookies.access_token;
    if (!token) throw new UnauthorizedException('Authentication required');
    if (!bearer && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) this.assertTrustedOrigin(request);

    try {
      const payload = await this.jwt.verifyAsync<AuthUser & { sub: string }>(token, {
        secret: this.getSecret(),
      });
      request.authUser = { id: payload.sub, email: payload.email, platformRole: payload.platformRole };
      return true;
    } catch {
      throw new UnauthorizedException('Session expired');
    }
  }

  private assertTrustedOrigin(request: FastifyRequest) {
    const origin = request.headers.origin;
    const allowed = (this.config.get<string>('WEB_ORIGIN') ?? 'http://localhost:3000').split(',').map((value) => value.trim());
    if (!origin || !allowed.includes(origin)) throw new ForbiddenException('Untrusted request origin');
  }

  private getSecret() {
    const secret = this.config.get<string>('JWT_ACCESS_SECRET');
    if (!secret || secret.length < 32) throw new Error('JWT_ACCESS_SECRET must contain at least 32 characters');
    return secret;
  }
}
