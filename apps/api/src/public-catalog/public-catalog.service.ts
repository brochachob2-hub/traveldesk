import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  getStorefront(slug: string) {
    return this.prisma.organization.findFirst({
      where: { slug, status: 'ACTIVE' },
      select: {
        name: true,
        slug: true,
        brandColor: true,
        logoUrl: true,
        currency: true,
        supportEmail: true,
        products: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            name: true,
            slug: true,
            summary: true,
            destination: true,
            durationDays: true,
            coverImageUrl: true,
            departures: {
              where: { startsAt: { gte: new Date() } },
              orderBy: { startsAt: 'asc' },
              take: 6,
              select: {
                id: true,
                startsAt: true,
                endsAt: true,
                capacity: true,
                reservedSeats: true,
                priceMinor: true,
                currency: true,
              },
            },
          },
        },
      },
    });
  }
}
