import { Module } from '@nestjs/common';
import { FLIGHT_PROVIDER } from './flight-provider';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { MockFlightProvider } from './mock-flight.provider';

@Module({
  controllers: [FlightsController],
  providers: [
    FlightsService,
    MockFlightProvider,
    {
      provide: FLIGHT_PROVIDER,
      inject: [MockFlightProvider],
      useFactory: (mock: MockFlightProvider) => mock,
    },
  ],
})
export class FlightsModule {}
