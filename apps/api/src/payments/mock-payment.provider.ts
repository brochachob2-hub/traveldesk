import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CheckoutSession, CreateCheckoutInput, PaymentProvider } from './payment-provider';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = 'mock';

  constructor(private readonly config: ConfigService) {}

  async createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession> {
    const webOrigin = (this.config.get<string>('WEB_ORIGIN') ?? 'http://localhost:3000').split(',')[0];
    return {
      providerPaymentId: `mock_${input.internalPaymentId}`,
      checkoutUrl: `${webOrigin}/payments/mock?paymentId=${encodeURIComponent(input.internalPaymentId)}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      isLive: false,
    };
  }
}
