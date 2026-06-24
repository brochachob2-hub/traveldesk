import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('returns a generic error for an unknown login email', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(null) } };
    const service = new AuthService(prisma as never, {} as never, {} as never);

    await expect(service.login({ email: 'missing@example.com', password: 'not-the-password' }, {}))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});
