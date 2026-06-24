import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PublicCatalogService } from './public-catalog.service';

@Controller('public/organizations')
export class PublicCatalogController {
  constructor(private readonly catalog: PublicCatalogService) {}

  @Get(':slug')
  async getStorefront(@Param('slug') slug: string) {
    const storefront = await this.catalog.getStorefront(slug);
    if (!storefront) throw new NotFoundException('Travel business not found');
    return storefront;
  }
}
