import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@UseGuards(AuthGuard)
@Controller('operator/organizations')
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.organizations.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() input: CreateOrganizationDto) {
    return this.organizations.create(user.id, input);
  }
}
