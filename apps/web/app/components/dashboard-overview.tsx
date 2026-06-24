import { ArrowUpRight, Bell, CalendarDays, ChevronDown, CircleDollarSign, Download, MoreHorizontal, Search, TicketCheck, TrendingUp, UsersRound } from 'lucide-react';

const bookings = [
  { guest: 'Mika Santos', initials: 'MS', tour: 'El Nido Escape', date: '18 Jul 2026', amount: '₱42,000', status: 'Paid', color: 'purple' },
  { guest: 'Paolo Lim', initials: 'PL', tour: 'Cebu South Adventure', date: '22 Jul 2026', amount: '₱18,600', status: 'Pending', color: 'blue' },
  { guest: 'Joy Mendoza', initials: 'JM', tour: 'Siargao Surf & Soul', date: '02 Aug 2026', amount: '₱30,400', status: 'Paid', color: 'orange' },
  { guest: 'Bea Navarro', initials: 'BN', tour: 'El Nido Escape', date: '18 Jul 2026', amount: '₱21,000', status: 'Paid', color: 'green' },
];

export function DashboardOverview({ businessName = 'Isla Trails', empty = false }: { businessName?: string; empty?: boolean }) {
  return <>
    <header className="dash-topbar"><div><div className="dash-search"><Search size={18}/><input placeholder="Search bookings, travelers, tours…"/><kbd>⌘ K</kbd></div></div><div className="dash-top-actions"><button className="date-control"><CalendarDays size={17}/> Jun 1 – Jun 30 <ChevronDown size={15}/></button><button className="icon-button notification-button"><Bell size={19}/><i/></button><span className="top-avatar">AR</span></div></header>
    <div className="dash-page">
      <div className="dash-page-heading"><div><span className="welcome-label">OVERVIEW</span><h1>Good morning, Ana <span>👋</span></h1><p>Here&apos;s what&apos;s happening with {businessName} today.</p></div><button className="button button-dark"><Download size={17}/> Export report</button></div>
      <div className="metric-grid">
        <Metric icon={<CircleDollarSign/>} label="Gross sales" value={empty?'₱0':'₱842,500'} delta="18.2%" note="vs. last month" tone="mint" />
        <Metric icon={<TicketCheck/>} label="Total bookings" value={empty?'0':'128'} delta="12.4%" note="vs. last month" tone="violet" />
        <Metric icon={<UsersRound/>} label="Upcoming travelers" value={empty?'0':'214'} delta="8.1%" note="next 30 days" tone="coral" />
        <Metric icon={<TrendingUp/>} label="Avg. booking value" value={empty?'₱0':'₱18,240'} delta="5.7%" note="vs. last month" tone="gold" />
      </div>

      <div className="dashboard-panels">
        <article className="panel revenue-panel"><div className="panel-head"><div><h3>Booking revenue</h3><p>Gross sales across tours and flights</p></div><button>Last 6 months <ChevronDown size={14}/></button></div><div className="chart-summary"><strong>{empty?'₱0':'₱2.48M'}</strong><span><ArrowUpRight size={14}/> 16.8%</span><small>total revenue</small></div><div className="revenue-chart"><div className="axis"><span>₱300K</span><span>₱200K</span><span>₱100K</span><span>₱0</span></div><div className="chart-area"><div className="chart-gridlines"><i/><i/><i/><i/></div><svg viewBox="0 0 700 180" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6c5ce7" stopOpacity=".28"/><stop offset="1" stopColor="#6c5ce7" stopOpacity="0"/></linearGradient></defs><path d={empty?'M0,165 L700,165':'M0,150 C50,145 75,122 120,130 S195,142 230,105 S310,115 350,86 S425,98 470,57 S545,72 585,38 S650,55 700,18 L700,180 L0,180Z'} fill="url(#chartFill)"/><path d={empty?'M0,165 L700,165':'M0,150 C50,145 75,122 120,130 S195,142 230,105 S310,115 350,86 S425,98 470,57 S545,72 585,38 S650,55 700,18'} fill="none" stroke="#6c5ce7" strokeWidth="3" strokeLinecap="round"/><circle cx="585" cy={empty?'165':'38'} r="5" fill="#fff" stroke="#6c5ce7" strokeWidth="3"/></svg><div className="chart-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></div></div></article>

        <article className="panel departures-panel"><div className="panel-head"><div><h3>Upcoming departures</h3><p>Next 30 days</p></div><button className="link-button">View calendar</button></div>{empty?<div className="empty-mini"><CalendarDays/><strong>No departures yet</strong><p>Create a tour to get started.</p></div>:<div className="departure-list"><Departure date="18" month="JUL" name="El Nido Escape" meta="14 travelers · 4 days" paid={86}/><Departure date="22" month="JUL" name="Cebu South Adventure" meta="8 travelers · 3 days" paid={63}/><Departure date="02" month="AUG" name="Siargao Surf & Soul" meta="12 travelers · 5 days" paid={75}/></div>}</article>
      </div>

      <article className="panel bookings-panel"><div className="panel-head"><div><h3>Recent bookings</h3><p>Your latest customer reservations</p></div><button className="link-button">View all bookings <ArrowUpRight size={15}/></button></div>{empty?<div className="empty-table"><TicketCheck/><h3>No bookings yet</h3><p>Bookings will appear here after your storefront is published.</p></div>:<div className="data-table"><div className="table-row table-header"><span>Guest</span><span>Tour</span><span>Departure</span><span>Amount</span><span>Status</span><span/></div>{bookings.map(row=><div className="table-row" key={row.guest}><span className="guest-cell"><i className={row.color}>{row.initials}</i><strong>{row.guest}</strong></span><span>{row.tour}</span><span>{row.date}</span><span><strong>{row.amount}</strong></span><span><em className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</em></span><span><MoreHorizontal size={18}/></span></div>)}</div>}</article>
    </div>
  </>;
}

function Metric({ icon, label, value, delta, note, tone }: { icon: React.ReactNode; label: string; value: string; delta: string; note: string; tone: string }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><button><MoreHorizontal size={18}/></button><p>{label}</p><strong>{value}</strong><div><span><ArrowUpRight size={13}/>{delta}</span><small>{note}</small></div></article>;
}

function Departure({date,month,name,meta,paid}:{date:string;month:string;name:string;meta:string;paid:number}) {
  return <div className="departure-item"><div className="departure-date"><strong>{date}</strong><small>{month}</small></div><div className="departure-info"><strong>{name}</strong><span>{meta}</span><div className="departure-progress"><i><b style={{width:`${paid}%`}}/></i><small>{paid}% paid</small></div></div><button><MoreHorizontal size={17}/></button></div>;
}
