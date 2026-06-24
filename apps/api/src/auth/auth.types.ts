import type { PlatformRole } from '@traveldesk/database';

export type AuthUser = {
  id: string;
  email: string | null;
  platformRole: PlatformRole;
};

export type RequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
};
