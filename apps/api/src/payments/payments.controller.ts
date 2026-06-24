import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PaymentsService } from './payments.service';

@Controller('public/bookings/:reference/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('checkout')
  createCheckout(@Param('reference') reference: string, @Body() input: CreateCheckoutDto) {
    return this.payments.createCheckout(reference, input.bookingAccessToken);
  }
}
