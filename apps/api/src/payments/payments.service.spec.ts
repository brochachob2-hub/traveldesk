import { UnauthorizedException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  it('requires the private booking access token', async () => {
    const prisma = {
      booking: {
        findUnique: jest.fn().mockResolvedValue({
          accessTokenHash: createHash('sha256').update('correct-token-that-is-long-enough').digest('hex'),
          status: 'PENDING_PAYMENT',
        }),
      },
    };
    const provider = { name: 'mock', createCheckout: jest.fn() };
    const service = new PaymentsService(prisma as never, provider as never);

    await expect(service.createCheckout('LBY-TEST', 'wrong-token-that-is-also-long-enough'))
      .rejects.toBeInstanceOf(UnauthorizedException);
    expect(provider.createCheckout).not.toHaveBeenCalled();
  });
});
