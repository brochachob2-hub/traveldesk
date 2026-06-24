import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TenantAccessService } from './tenant-access.service';

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController, ProductsController],
  providers: [OrganizationsService, ProductsService, TenantAccessService],
})
export class OperatorsModule {}
