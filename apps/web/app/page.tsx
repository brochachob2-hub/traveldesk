import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Check,
  Headphones,
  Plane,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from './components/logo';

const services = [
  {
    icon: <Search />,
    title: 'Search and booking',
    copy: 'Let customers check tours and flights, choose dates, and book without waiting for a reply.',
  },
  {
    icon: <CalendarDays />,
    title: 'Live availability',
    copy: 'Keep seats, departures, appointments, and booking cutoffs accurate in one calendar.',
  },
  {
    icon: <BarChart3 />,
    title: 'Business operations',
    copy: 'Manage payments, travelers, staff activity, and daily sales from one practical workspace.',
  },
];

const steps = [
  ['01', 'Set up your business', 'Add your brand, services, schedules, payment rules, and staff.'],
  ['02', 'Publish your booking site', 'Give customers a professional website they can also install as an app.'],
  ['03', 'Run everything in one place', 'Confirm bookings, track payments, and keep customers updated.'],
];

export default function HomePage() {
  return (
    <main className="td-page">
      <header className="td-header">
        <div className="td-container td-nav">
          <Logo />
          <nav className="td-nav-links" aria-label="Primary navigation">
            <a href="#platform">Platform</a>
            <a href="#how-it-works">How it works</a>
            <a href="#business">For agencies</a>
            <Link href="/login">Sign in</Link>
            <Link href="/register" className="td-nav-cta">Start now</Link>
          </nav>
        </div>
      </header>

      <section className="td-hero">
        <div className="td-container td-hero-grid">
          <div className="td-hero-copy">
            <span className="td-overline">Booking software for Philippine travel businesses</span>
            <h1>Run your travel business from one desk.</h1>
            <p>
              TravelDesk gives your customers a proper place to search and book, while your team manages
              availability, payments, and travelers behind the scenes.
            </p>
            <div className="td-actions">
              <Link href="/register" className="td-button td-button-primary">
                Build your booking site <ArrowRight size={18} />
              </Link>
              <Link href="/demo-travel" className="td-button td-button-secondary">View customer demo</Link>
            </div>
            <div className="td-hero-trust">
              <span><ShieldCheck size={18} /> Secure booking flow</span>
              <span><BadgeCheck size={18} /> Your own brand</span>
            </div>
          </div>

          <div className="td-hero-media">
            <Image
              src="/destinations/palawan.svg"
              alt="A tropical Palawan destination"
              width={760}
              height={560}
              priority
            />
            <div className="td-booking-board">
              <span className="td-board-label">NEXT DEPARTURE</span>
              <strong>El Nido Island Escape</strong>
              <div className="td-board-route"><Plane size={17} /> Manila <ArrowRight size={14} /> El Nido</div>
              <div className="td-board-meta">
                <span><b>18 Jul</b><small>Departure</small></span>
                <span><b>12 / 14</b><small>Travelers paid</small></span>
              </div>
            </div>
            <div className="td-confirmed"><Check size={17} /> Booking confirmed</div>
          </div>
        </div>
      </section>

      <section className="td-proof-bar">
        <div className="td-container">
          <span>Built for independent operators</span>
          <strong>Branded website</strong>
          <strong>Customer booking app</strong>
          <strong>Admin workspace</strong>
          <strong>Philippine peso ready</strong>
        </div>
      </section>

      <section id="platform" className="td-services">
        <div className="td-container">
          <div className="td-section-heading">
            <span>WHAT TRAVELDESK DOES</span>
            <h2>Less manual follow-up. More confirmed bookings.</h2>
            <p>One connected system for the customer experience and the work your team does every day.</p>
          </div>
          <div className="td-service-grid">
            {services.map((service) => (
              <article key={service.title} className="td-service-item">
                <div className="td-service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="business" className="td-split-section">
        <div className="td-container td-split-grid">
          <div className="td-destination-panel">
            <Image src="/destinations/cebu.svg" alt="Cebu travel destination" width={720} height={620} />
            <div className="td-sales-card">
              <span>BOOKINGS THIS MONTH</span>
              <strong>128</strong>
              <small>18% higher than last month</small>
            </div>
          </div>
          <div className="td-split-copy">
            <span className="td-overline">Made for real agency work</span>
            <h2>Stop running the business through chat threads.</h2>
            <p>
              Inquiries can still start on Messenger or Viber. The actual booking should move into a system
              your staff and customers can trust.
            </p>
            <ul>
              <li><Check /> Availability is checked before a customer pays.</li>
              <li><Check /> Every booking has one clear status and payment record.</li>
              <li><Check /> Staff work from the same customer and departure data.</li>
              <li><Check /> Customers receive a consistent, branded experience.</li>
            </ul>
            <Link href="/demo-dashboard" className="td-text-link">See the business dashboard <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="td-process">
        <div className="td-container">
          <div className="td-section-heading td-section-heading-left">
            <span>HOW IT WORKS</span>
            <h2>From setup to your first online booking.</h2>
          </div>
          <div className="td-step-grid">
            {steps.map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="td-support-band">
        <div className="td-container">
          <div>
            <span className="td-support-icon"><Headphones /></span>
            <div><strong>You are not buying software and figuring it out alone.</strong><p>TravelDesk onboarding helps your team set up services, schedules, and booking rules correctly.</p></div>
          </div>
          <div className="td-support-stats">
            <span><Users /><b>Team onboarding</b></span>
            <span><ShieldCheck /><b>Operational safeguards</b></span>
          </div>
        </div>
      </section>

      <section className="td-final-cta">
        <div className="td-container">
          <div>
            <span>READY TO OPERATE PROFESSIONALLY?</span>
            <h2>Give customers confidence before they send a payment.</h2>
          </div>
          <Link href="/register" className="td-button td-button-orange">Start building <ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="td-footer">
        <div className="td-container">
          <Logo inverse />
          <p>Booking and operations software for Philippine travel businesses.</p>
          <div><a href="#platform">Platform</a><a href="#how-it-works">How it works</a><a>Privacy</a><a>Terms</a></div>
          <small>© 2026 TravelDesk Technologies</small>
        </div>
      </footer>
    </main>
  );
}
