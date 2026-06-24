import Link from 'next/link';

export default function MockPaymentPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand"><span className="brand-mark">T</span>TravelDesk</div>
        <div><div className="eyebrow">Test checkout</div><h2>No payment collected</h2></div>
        <p>This screen proves the checkout handoff without pretending a live payment provider is connected.</p>
        <div className="card"><small>PAYMENT PROVIDER</small><h3>Mock mode</h3><p>Supplier credentials and webhook verification are required before real transactions.</p></div>
        <Link className="button" href="/demo-travel">Return to storefront</Link>
      </section>
    </main>
  );
}
