import { ConflictException, GoneException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@traveldesk/database';
import { createHash, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PAYMENT_PROVIDER } from './payment-provider';
import type { PaymentProvider } from './payment-provider';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER) private readonly provider: PaymentProvider,
  ) {}

  async createCheckout(reference: string, bookingAccessToken: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { reference },
      select: {
        id: true,
        reference: true,
        status: true,
        expiresAt: true,
        accessTokenHash: true,
        guestEmail: true,
        totalMinor: true,
        currency: true,
        organizationId: true,
        departure: { select: { product: { select: { name: true, organization: { select: { slug: true } } } } } },
        payments: { where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (!this.matchesAccessToken(booking.accessTokenHash, bookingAccessToken)) throw new UnauthorizedException('Invalid booking access token');
    if (booking.status !== 'PENDING_PAYMENT') throw new ConflictException('Booking is not awaiting payment');
    if (!booking.expiresAt || booking.expiresAt <= new Date()) throw new GoneException('Booking reservation has expired');

    const existing = booking.payments[0];
    if (existing?.checkoutUrl) return this.response(existing.id, existing.checkoutUrl, false);

    const idempotencyKey = `booking:${booking.id}:full-payment`;
    let payment = existing;
    if (!payment) {
      try {
        payment = await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            organizationId: booking.organizationId,
            provider: this.provider.name,
            idempotencyKey,
            amountMinor: booking.totalMinor,
            currency: booking.currency,
          },
        });
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') throw error;
        payment = await this.prisma.payment.findUnique({ where: { idempotencyKey } }) ?? undefined;
      }
    }
    if (!payment) throw new ConflictException('Unable to initialize payment');
    if (payment.checkoutUrl) return this.response(payment.id, payment.checkoutUrl, false);

    const webOrigin = process.env.WEB_ORIGIN?.split(',')[0] ?? 'http://localhost:3000';
    const checkout = await this.provider.createCheckout({
      internalPaymentId: payment.id,
      idempotencyKey,
      amountMinor: booking.totalMinor,
      currency: booking.currency,
      description: `${booking.departure.product.name} · ${booking.reference}`,
      customerEmail: booking.guestEmail,
      successUrl: `${webOrigin}/bookings/${booking.reference}?payment=success`,
      cancelUrl: `${webOrigin}/bookings/${booking.reference}?payment=cancelled`,
    });
    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { providerPaymentId: checkout.providerPaymentId, checkoutUrl: checkout.checkoutUrl },
    });
    return this.response(updated.id, checkout.checkoutUrl, checkout.isLive);
  }

  private response(paymentId: string, checkoutUrl: string, live: boolean) {
    return {
      paymentId,
      checkoutUrl,
      live,
      warning: live ? undefined : 'Test checkout only. No money will be collected.',
    };
  }

  private matchesAccessToken(expectedHash: string, token: string) {
    const actual = Buffer.from(createHash('sha256').update(token).digest('hex'), 'hex');
    const expected = Buffer.from(expectedHash, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }
}
