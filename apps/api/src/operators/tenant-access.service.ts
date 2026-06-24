import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { OrganizationRole } from '@traveldesk/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async requireMembership(userId: string, organizationId: string, allowedRoles?: OrganizationRole[]) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
      select: { role: true, organization: { select: { id: true, name: true, slug: true, status: true } } },
    });
    if (!membership) throw new NotFoundException('Organization not found');
    if (allowedRoles && !allowedRoles.includes(membership.role)) throw new ForbiddenException('Insufficient organization permission');
    return membership;
  }
}
