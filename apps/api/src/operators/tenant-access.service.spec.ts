import { NotFoundException } from '@nestjs/common';
import { TenantAccessService } from './tenant-access.service';

describe('TenantAccessService', () => {
  it('does not reveal organizations without membership', async () => {
    const prisma = { membership: { findUnique: jest.fn().mockResolvedValue(null) } };
    const service = new TenantAccessService(prisma as never);

    await expect(service.requireMembership('user-a', 'organization-b')).rejects.toBeInstanceOf(NotFoundException);
  });
});
