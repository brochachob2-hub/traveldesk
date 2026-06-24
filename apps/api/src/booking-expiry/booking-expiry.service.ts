import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingExpiryService {
  private readonly logger = new Logger(BookingExpiryService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async expireDueReservations() {
    const expired = await this.prisma.booking.findMany({
      where: { status: 'PENDING_PAYMENT', expiresAt: { lte: new Date() } },
      select: { id: true, departureId: true, seats: true },
      take: 100,
      orderBy: { expiresAt: 'asc' },
    });
    let released = 0;
    for (const booking of expired) {
      released += await this.expireOne(booking.id, booking.departureId, booking.seats);
    }
    if (released > 0) this.logger.log(`Released ${released} expired reservation(s)`);
    return released;
  }

  private async expireOne(bookingId: string, departureId: string, seats: number) {
    return this.prisma.$transaction(async (tx) => {
      const changed = await tx.booking.updateMany({
        where: { id: bookingId, status: 'PENDING_PAYMENT', expiresAt: { lte: new Date() } },
        data: { status: 'CANCELLED' },
      });
      if (changed.count !== 1) return 0;
      await tx.$executeRaw`
        UPDATE "Departure"
        SET "reservedSeats" = GREATEST(0, "reservedSeats" - ${seats}), "updatedAt" = NOW()
        WHERE "id" = ${departureId}
      `;
      await tx.payment.updateMany({ where: { bookingId, status: 'PENDING' }, data: { status: 'CANCELLED' } });
      return 1;
    });
  }
}
