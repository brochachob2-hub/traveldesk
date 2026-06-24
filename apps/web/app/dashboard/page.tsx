'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardOverview } from '../components/dashboard-overview';
import { DashboardShell } from '../components/dashboard-shell';
import { apiRequest } from '../lib/api';

type Membership = { role: string; organization: { id: string; name: string; slug: string; status: string; subscriptionPlan: string } };

export default function DashboardPage() {
  const router = useRouter();
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => { apiRequest<Membership[]>('/operator/organizations').then(items => { const first=items[0]; if(first)setMembership(first); else router.replace('/onboarding'); }).catch(()=>router.replace('/login')); }, [router]);
  return <DashboardShell active="Overview" businessName={membership?.organization.name}><DashboardOverview businessName={membership?.organization.name} empty /></DashboardShell>;
}
