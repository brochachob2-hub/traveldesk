import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateBookingDto) {
    if (input.travelers.length !== input.seats) {
      throw new BadRequestException('Traveler count must match the number of seats');
    }

    const bookingAccessToken = randomBytes(32).toString('base64url');
    const booking = await this.prisma.$transaction(async (tx) => {
      const departure = await tx.departure.findFirst({
        where: {
          id: input.departureId,
          product: {
            status: 'PUBLISHED',
            organization: { slug: input.organizationSlug, status: 'ACTIVE' },
          },
        },
        select: { id: true, priceMinor: true, currency: true, startsAt: true, product: { select: { organizationId: true } } },
      });

      if (!departure) throw new NotFoundException('Departure not found');
      if (departure.startsAt <= new Date()) throw new BadRequestException('Departure has already started');

      const seatsReserved = await tx.$executeRaw`
        UPDATE "Departure"
        SET "reservedSeats" = "reservedSeats" + ${input.seats}, "updatedAt" = NOW()
        WHERE "id" = ${departure.id}
          AND "capacity" - "reservedSeats" >= ${input.seats}
      `;

      if (seatsReserved !== 1) throw new ConflictException('Not enough seats available');

      const booking = await tx.booking.create({
        data: {
          reference: `LBY-${randomBytes(4).toString('hex').toUpperCase()}`,
          organizationId: departure.product.organizationId,
          departureId: departure.id,
          guestEmail: input.email.toLowerCase(),
          guestPhone: input.phone,
          seats: input.seats,
          totalMinor: departure.priceMinor * input.seats,
          currency: departure.currency,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          accessTokenHash: createHash('sha256').update(bookingAccessToken).digest('hex'),
          travelers: { create: input.travelers },
        },
        select: {
          reference: true,
          status: true,
          seats: true,
          totalMinor: true,
          currency: true,
          expiresAt: true,
        },
      });

      return booking;
    });
    return { ...booking, bookingAccessToken };
  }
}
