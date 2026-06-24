import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@UseGuards(AuthGuard)
@Controller('operator/organizations/:organizationId/products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string) {
    return this.products.list(user.id, organizationId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string, @Body() input: CreateProductDto) {
    return this.products.create(user.id, organizationId, input);
  }

  @Patch(':productId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('organizationId') organizationId: string,
    @Param('productId') productId: string,
    @Body() input: UpdateProductDto,
  ) {
    return this.products.update(user.id, organizationId, productId, input);
  }

  @Delete(':productId')
  archive(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string, @Param('productId') productId: string) {
    return this.products.archive(user.id, organizationId, productId);
  }

  @Post(':productId/departures')
  addDeparture(
    @CurrentUser() user: AuthUser,
    @Param('organizationId') organizationId: string,
    @Param('productId') productId: string,
    @Body() input: CreateDepartureDto,
  ) {
    return this.products.addDeparture(user.id, organizationId, productId, input);
  }
}
