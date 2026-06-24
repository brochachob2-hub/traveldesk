import { DashboardOverview } from '../components/dashboard-overview';
import { DashboardShell } from '../components/dashboard-shell';

export default function DemoDashboardPage() {
  return <DashboardShell active="Overview"><DashboardOverview /></DashboardShell>;
}
