import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@traveldesk/database';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        organization: {
          select: { id: true, name: true, slug: true, status: true, brandColor: true, subscriptionPlan: true },
        },
      },
    });
  }

  async create(userId: string, input: CreateOrganizationDto) {
    try {
      return await this.prisma.organization.create({
        data: {
          name: input.name.trim(),
          slug: input.slug,
          brandColor: input.brandColor,
          supportEmail: input.supportEmail?.toLowerCase(),
          supportPhone: input.supportPhone,
          memberships: { create: { userId, role: 'OWNER' } },
        },
        select: { id: true, name: true, slug: true, status: true, brandColor: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('This business URL is already taken');
      }
      throw error;
    }
  }
}
