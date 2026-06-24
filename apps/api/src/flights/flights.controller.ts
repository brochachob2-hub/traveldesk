import { Controller, Get, Query } from '@nestjs/common';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightsService } from './flights.service';

@Controller('public/flights')
export class FlightsController {
  constructor(private readonly flights: FlightsService) {}

  @Get('search')
  search(@Query() input: SearchFlightsDto) {
    return this.flights.search(input);
  }
}
