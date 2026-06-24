import { Inject, Injectable } from '@nestjs/common';
import { FLIGHT_PROVIDER } from './flight-provider';
import type { FlightProvider } from './flight-provider';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Injectable()
export class FlightsService {
  constructor(@Inject(FLIGHT_PROVIDER) private readonly provider: FlightProvider) {}

  async search(input: SearchFlightsDto) {
    const offers = await this.provider.search({ ...input, origin: input.origin.toUpperCase(), destination: input.destination.toUpperCase() });
    return { offers, live: offers.every((offer) => offer.isLive), warning: 'Test inventory only. No ticket will be issued.' };
  }
}
