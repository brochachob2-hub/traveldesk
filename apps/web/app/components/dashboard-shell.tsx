'use client';

import { BarChart3, CalendarDays, Compass, Headphones, LayoutDashboard, LogOut, Plane, Settings, Ticket, Users } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from './logo';

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '#', label: 'Bookings', icon: Ticket },
  { href: '/dashboard/tours', label: 'Tours', icon: Compass },
  { href: '#', label: 'Flights', icon: Plane },
  { href: '#', label: 'Customers', icon: Users },
  { href: '#', label: 'Analytics', icon: BarChart3 },
];

export function DashboardShell({ active, businessName, children }: { active: string; businessName?: string; children: ReactNode }) {
  return (
    <main className="dashboard-shell">
      <aside className="dash-sidebar">
        <Logo inverse />
        <div className="workspace-switcher"><span className="workspace-avatar">IT</span><div><small>Workspace</small><strong>{businessName ?? 'Isla Trails'}</strong></div><span className="workspace-chevron">⌄</span></div>
        <nav className="dash-nav">
          <span className="nav-label">Workspace</span>
          {items.map(({ href, label, icon: Icon }) => <Link key={label} href={href} className={active === label ? 'active' : ''}><Icon size={18} strokeWidth={1.8} />{label}</Link>)}
          <span className="nav-label nav-label-spaced">Manage</span>
          <a><CalendarDays size={18} />Availability</a><a><Settings size={18} />Settings</a>
        </nav>
        <div className="sidebar-help"><span><Headphones size={18} /></span><strong>Need help?</strong><p>Talk to our support team.</p><button>Contact support</button></div>
        <div className="sidebar-user"><span>AR</span><div><strong>Ana Reyes</strong><small>Owner</small></div><LogOut size={17} /></div>
      </aside>
      <section className="dash-content">{children}</section>
    </main>
  );
}
