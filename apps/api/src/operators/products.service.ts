import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@traveldesk/database';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TenantAccessService } from './tenant-access.service';

const EDITOR_ROLES = ['OWNER', 'ADMIN', 'AGENT'] as const;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly access: TenantAccessService) {}

  async list(userId: string, organizationId: string) {
    await this.access.requireMembership(userId, organizationId);
    return this.prisma.travelProduct.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { departures: { orderBy: { startsAt: 'asc' } } },
    });
  }

  async create(userId: string, organizationId: string, input: CreateProductDto) {
    await this.access.requireMembership(userId, organizationId, [...EDITOR_ROLES]);
    try {
      return await this.prisma.travelProduct.create({ data: { ...input, organizationId } });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  async update(userId: string, organizationId: string, productId: string, input: UpdateProductDto) {
    await this.access.requireMembership(userId, organizationId, [...EDITOR_ROLES]);
    const existing = await this.prisma.travelProduct.findFirst({
      where: { id: productId, organizationId },
      select: { id: true, _count: { select: { departures: true } } },
    });
    if (!existing) throw new NotFoundException('Tour not found');
    if (input.status === 'PUBLISHED' && existing._count.departures === 0) {
      throw new BadRequestException('Add at least one departure before publishing');
    }
    try {
      return await this.prisma.travelProduct.update({ where: { id: existing.id }, data: input });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  async archive(userId: string, organizationId: string, productId: string) {
    await this.access.requireMembership(userId, organizationId, [...EDITOR_ROLES]);
    const result = await this.prisma.travelProduct.updateMany({
      where: { id: productId, organizationId },
      data: { status: 'ARCHIVED' },
    });
    if (result.count !== 1) throw new NotFoundException('Tour not found');
    return { archived: true };
  }

  async addDeparture(userId: string, organizationId: string, productId: string, input: CreateDepartureDto) {
    await this.access.requireMembership(userId, organizationId, [...EDITOR_ROLES]);
    const product = await this.prisma.travelProduct.findFirst({ where: { id: productId, organizationId }, select: { id: true } });
    if (!product) throw new NotFoundException('Tour not found');
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);
    if (startsAt <= new Date() || endsAt <= startsAt) throw new BadRequestException('Departure dates are invalid');
    return this.prisma.departure.create({
      data: { ...input, currency: input.currency.toUpperCase(), startsAt, endsAt, productId },
    });
  }

  private handleUnique(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('This tour URL is already in use');
    }
    throw error;
  }
}
