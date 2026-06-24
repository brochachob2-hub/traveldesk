import { ForbiddenException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('rejects cookie-authenticated mutations from an untrusted origin', async () => {
    const jwt = { verifyAsync: jest.fn() };
    const config = { get: jest.fn().mockReturnValue('http://localhost:3000') };
    const request = {
      headers: { origin: 'https://malicious.example' },
      cookies: { access_token: 'token' },
      method: 'POST',
    };
    const context = { switchToHttp: () => ({ getRequest: () => request }) };
    const guard = new AuthGuard(jwt as never, config as never);

    await expect(guard.canActivate(context as never)).rejects.toBeInstanceOf(ForbiddenException);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });
});
