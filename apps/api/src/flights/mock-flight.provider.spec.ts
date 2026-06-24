import { MockFlightProvider } from './mock-flight.provider';

describe('MockFlightProvider', () => {
  it('returns clearly marked non-live test inventory', async () => {
    const provider = new MockFlightProvider();
    const offers = await provider.search({
      origin: 'MNL',
      destination: 'CEB',
      departureDate: '2030-07-18',
      adults: 2,
    });

    expect(offers).toHaveLength(1);
    expect(offers[0]).toMatchObject({
      provider: 'mock',
      origin: 'MNL',
      destination: 'CEB',
      amountMinor: 770000,
      currency: 'PHP',
      isLive: false,
    });
  });
});
