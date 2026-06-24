import { Injectable } from '@nestjs/common';
import { FlightOffer, FlightProvider, FlightSearch } from './flight-provider';

@Injectable()
export class MockFlightProvider implements FlightProvider {
  async search(input: FlightSearch): Promise<FlightOffer[]> {
    const departure = new Date(`${input.departureDate}T08:00:00+08:00`);
    const arrival = new Date(departure.getTime() + 90 * 60 * 1000);
    return [
      {
        id: `mock-${input.origin}-${input.destination}-${input.departureDate}`,
        provider: 'mock',
        airline: 'Demo Air',
        flightNumber: 'DM101',
        origin: input.origin.toUpperCase(),
        destination: input.destination.toUpperCase(),
        departsAt: departure.toISOString(),
        arrivesAt: arrival.toISOString(),
        amountMinor: 385000 * input.adults,
        currency: 'PHP',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        isLive: false,
      },
    ];
  }
}
