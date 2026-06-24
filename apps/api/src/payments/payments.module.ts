import { Module } from '@nestjs/common';
import { MockPaymentProvider } from './mock-payment.provider';
import { PAYMENT_PROVIDER } from './payment-provider';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    MockPaymentProvider,
    { provide: PAYMENT_PROVIDER, inject: [MockPaymentProvider], useFactory: (mock: MockPaymentProvider) => mock },
  ],
})
export class PaymentsModule {}
