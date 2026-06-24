export type CreateCheckoutInput = {
  internalPaymentId: string;
  idempotencyKey: string;
  amountMinor: number;
  currency: string;
  description: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  providerPaymentId: string;
  checkoutUrl: string;
  expiresAt?: string;
  isLive: boolean;
};

export interface PaymentProvider {
  readonly name: string;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession>;
}

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');
