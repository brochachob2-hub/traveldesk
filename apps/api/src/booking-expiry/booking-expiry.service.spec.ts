import { BookingExpiryService } from './booking-expiry.service';

describe('BookingExpiryService', () => {
  it('cancels expired bookings and releases reserved seats once', async () => {
    const tx = {
      booking: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      $executeRaw: jest.fn().mockResolvedValue(1),
      payment: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    const prisma = {
      booking: { findMany: jest.fn().mockResolvedValue([{ id: 'booking-1', departureId: 'departure-1', seats: 2 }]) },
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    };
    const service = new BookingExpiryService(prisma as never);

    await expect(service.expireDueReservations()).resolves.toBe(1);
    expect(tx.booking.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: 'booking-1', status: 'PENDING_PAYMENT' }),
    }));
    expect(tx.payment.updateMany).toHaveBeenCalled();
  });
});
