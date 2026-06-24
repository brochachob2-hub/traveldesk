import { Module } from '@nestjs/common';
import { BookingExpiryService } from './booking-expiry.service';

@Module({ providers: [BookingExpiryService], exports: [BookingExpiryService] })
export class BookingExpiryModule {}
