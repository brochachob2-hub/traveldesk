export type FlightSearch = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
};

export type FlightOffer = {
  id: string;
  provider: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departsAt: string;
  arrivesAt: string;
  amountMinor: number;
  currency: string;
  expiresAt: string;
  isLive: boolean;
};

export interface FlightProvider {
  search(input: FlightSearch): Promise<FlightOffer[]>;
}

export const FLIGHT_PROVIDER = Symbol('FLIGHT_PROVIDER');
