import { BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';

describe('BookingsService', () => {
  it('rejects a traveler count that does not match reserved seats', async () => {
    const prisma = { $transaction: jest.fn() };
    const service = new BookingsService(prisma as never);

    await expect(
      service.create({
        organizationSlug: 'demo-travel',
        departureId: 'departure-1',
        email: 'guest@example.com',
        seats: 2,
        travelers: [{ firstName: 'Ana', lastName: 'Reyes' }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
