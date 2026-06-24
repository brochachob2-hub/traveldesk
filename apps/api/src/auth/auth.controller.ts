import { Body, Controller, ForbiddenException, HttpCode, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { AuthUser } from './auth.types';
import { FederatedLoginDto } from './dto/federated-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
@Throttle({ default: { limit: 10, ttl: 60_000 } })
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}

  @Post('register')
  async register(@Body() input: RegisterDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.auth.register(input, this.metadata(request));
    this.setCookies(reply, result.accessToken, result.refreshToken, result.refreshExpiresAt);
    return { user: result.user };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() input: LoginDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.auth.login(input, this.metadata(request));
    this.setCookies(reply, result.accessToken, result.refreshToken, result.refreshExpiresAt);
    return { user: result.user };
  }

  @Post('federated')
  @HttpCode(200)
  async federated(@Body() input: FederatedLoginDto, @Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const result = await this.auth.federatedLogin(input.idToken, this.metadata(request));
    this.setCookies(reply, result.accessToken, result.refreshToken, result.refreshExpiresAt);
    return { user: result.user, profileComplete: result.profileComplete };
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  updateProfile(@CurrentUser() user: AuthUser, @Body() input: UpdateProfileDto) {
    return this.auth.updateProfile(user.id, input);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    this.assertTrustedOrigin(request);
    const result = await this.auth.refresh(request.cookies.refresh_token, this.metadata(request));
    this.setCookies(reply, result.accessToken, result.refreshToken, result.refreshExpiresAt);
    return { user: result.user };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    this.assertTrustedOrigin(request);
    await this.auth.logout(request.cookies.refresh_token);
    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/api/auth' });
  }

  private metadata(request: FastifyRequest) {
    return { ipAddress: request.ip, userAgent: request.headers['user-agent'] };
  }

  private assertTrustedOrigin(request: FastifyRequest) {
    const origin = request.headers.origin;
    const allowed = (this.config.get<string>('WEB_ORIGIN') ?? 'http://localhost:3000').split(',').map((value) => value.trim());
    if (!origin || !allowed.includes(origin)) throw new ForbiddenException('Untrusted request origin');
  }

  private setCookies(reply: FastifyReply, accessToken: string, refreshToken: string, refreshExpiresAt: Date) {
    const secure = process.env.NODE_ENV === 'production';
    const domain = process.env.COOKIE_DOMAIN || undefined;
    reply.setCookie('access_token', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      domain,
      maxAge: 15 * 60,
    });
    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api/auth',
      domain,
      expires: refreshExpiresAt,
    });
  }
}
