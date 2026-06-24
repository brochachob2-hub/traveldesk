import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ChevronDown, Clock3, Heart, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, Users, WalletCards } from 'lucide-react';

type PageProps = { params: Promise<{ tenant: string }> };

const tours = [
  { name: 'El Nido Island Escape', destination: 'El Nido, Palawan', price: '₱10,500', days: '4 days', rating: '4.9', reviews: '128', image: '/destinations/palawan.svg', tag: 'Bestseller', tone: 'teal' },
  { name: 'Cebu South Adventure', destination: 'Moalboal, Cebu', price: '₱7,900', days: '3 days', rating: '4.8', reviews: '96', image: '/destinations/cebu.svg', tag: 'Small group', tone: 'coral' },
  { name: 'Siargao Surf & Soul', destination: 'General Luna, Siargao', price: '₱15,200', days: '5 days', rating: '5.0', reviews: '74', image: '/destinations/siargao.svg', tag: 'New', tone: 'violet' },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenant } = await params;
  return { title: tenant === 'demo-travel' ? 'Isla Trails' : tenant };
}

export default async function StorefrontPage({ params }: PageProps) {
  const { tenant } = await params;
  const brand = tenant === 'demo-travel' ? 'Isla Trails' : tenant.replaceAll('-', ' ');
  return (
    <main className="storefront-page">
      <header className="store-header"><div className="store-container nav"><Link href={`/${tenant}`} className="store-logo"><span>IT</span><div><strong>{brand}</strong><small>TRAVEL & TOURS</small></div></Link><nav className="store-nav"><a href="#tours">Tours</a><a>Destinations</a><a>About us</a><a>Travel guide</a></nav><div className="store-actions"><button className="icon-button"><Heart size={19}/></button><button className="button button-dark button-sm">My bookings</button><button className="mobile-menu"><Menu/></button></div></div></header>

      <section className="store-hero-new">
        <div className="store-hero-text"><div className="destination-kicker"><span /><MapPin size={14}/> Locally curated in the Philippines</div><h1>Find your<br/><em>kind of escape.</em></h1><p>Thoughtful island trips, local guides, and zero-stress planning from people who know every hidden cove.</p><div className="store-trust"><div className="store-avatars"><span>JR</span><span>KL</span><span>AM</span></div><p><strong>2,400+ happy travelers</strong><span><Star size={13} fill="currentColor"/> 4.9 average rating</span></p></div></div>
        <div className="store-hero-art"><div className="sun-disc"/><Image src="/destinations/palawan.svg" alt="Stylized tropical islands of Palawan" fill priority sizes="(max-width: 800px) 100vw, 55vw"/><div className="hero-art-badge"><span><Sparkles size={18}/></span><p><small>THIS MONTH&apos;S PICK</small><strong>El Nido Escape</strong></p></div></div>
        <div className="booking-search"><label><span><MapPin size={18}/></span><div><small>WHERE TO?</small><strong>Choose destination</strong></div><ChevronDown size={16}/></label><label><span><CalendarDays size={18}/></span><div><small>WHEN?</small><strong>Select your dates</strong></div><ChevronDown size={16}/></label><label><span><Users size={18}/></span><div><small>TRAVELERS</small><strong>2 guests</strong></div><ChevronDown size={16}/></label><button><Search size={20}/> Search trips</button></div>
      </section>

      <section id="tours" className="store-container store-section">
        <div className="store-section-head"><div><span className="section-kicker">Handpicked for you</span><h2>Trips travelers love</h2><p>Small groups, local experts, unforgettable places.</p></div><a>View all tours <ArrowRight size={17}/></a></div>
        <div className="tour-card-grid">{tours.map((tour) => <article className="tour-card" key={tour.name}><div className="tour-image"><Image src={tour.image} alt={tour.destination} fill sizes="(max-width: 760px) 100vw, 33vw"/><span className={`tour-tag ${tour.tone}`}>{tour.tag}</span><button aria-label={`Save ${tour.name}`}><Heart size={18}/></button></div><div className="tour-body"><div className="tour-location"><MapPin size={14}/>{tour.destination}</div><h3>{tour.name}</h3><div className="tour-meta"><span><Clock3 size={15}/>{tour.days}</span><span><Star size={15} fill="currentColor"/>{tour.rating} <small>({tour.reviews})</small></span></div><div className="tour-footer"><p>From <strong>{tour.price}</strong><small>/ person</small></p><button><ArrowRight size={18}/></button></div></div></article>)}</div>
      </section>

      <section className="why-section"><div className="store-container"><div className="why-heading"><span className="section-kicker">The Isla Trails difference</span><h2>Big memories.<br/>Fewer worries.</h2></div><div className="why-grid"><article><span><ShieldCheck/></span><h3>Book with confidence</h3><p>Verified local partners and clear cancellation policies.</p></article><article><span><Users/></span><h3>Travel like a local</h3><p>Guides who know the stories, people, and secret places.</p></article><article><span><WalletCards/></span><h3>Simple, secure payments</h3><p>Transparent peso pricing with no surprise fees.</p></article><article><span><Sparkles/></span><h3>Details handled</h3><p>We coordinate every transfer, activity, and check-in.</p></article></div></div></section>

      <section className="store-container story-section"><div className="story-art"><Image src="/destinations/siargao.svg" fill alt="Siargao surf escape" sizes="50vw"/><span className="story-stamp">LOCAL<br/>SINCE<br/>2018</span></div><div><span className="section-kicker">Our story</span><h2>Made by island people, for curious travelers.</h2><p>We started Isla Trails because the best parts of the Philippines rarely fit into a generic package. Every trip is shaped with local hosts, family-run stays, and guides we know by name.</p><a>Meet the team <ArrowRight size={16}/></a><div className="story-numbers"><p><strong>42</strong><span>local partners</span></p><p><strong>18</strong><span>island routes</span></p><p><strong>4.9</strong><span>guest rating</span></p></div></div></section>

      <section className="store-newsletter"><div className="store-container"><div><span className="section-kicker light">The good kind of inbox</span><h2>New islands, secret spots,<br/>and occasional seat sales.</h2></div><form><input type="email" placeholder="Your email address"/><button>Join the list <ArrowRight size={17}/></button><small>No spam. Just trip-worthy ideas.</small></form></div></section>

      <footer className="store-footer"><div className="store-container"><Link href={`/${tenant}`} className="store-logo inverse"><span>IT</span><div><strong>{brand}</strong><small>TRAVEL & TOURS</small></div></Link><p>Curated Philippine journeys with heart.</p><div><a>Tours</a><a>About</a><a>FAQs</a><a>Contact</a></div><small>Powered by TravelDesk</small></div></footer>
    </main>
  );
}
