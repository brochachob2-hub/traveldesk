'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { AuthVisual } from '../components/auth-visual';
import { Logo } from '../components/logo';
import { apiRequest } from '../lib/api';

export default function CompleteProfilePage() {
  const router = useRouter();
  const nextPath = useMemo(() => {
    if (typeof window === 'undefined') return '/dashboard';
    return new URLSearchParams(window.location.search).get('next') || '/dashboard';
  }, []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      await apiRequest('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: data.get('fullName'),
          cityOrigin: data.get('cityOrigin'),
        }),
      });
      router.push(nextPath);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <form className="auth-card" onSubmit={submit}>
          <Logo />
          <div className="auth-heading">
            <div className="eyebrow">One last step</div>
            <h2>Complete your profile</h2>
            <p>TravelDesk needs your legal full name and city of origin before you can continue.</p>
          </div>
          <label>Full name<input name="fullName" autoComplete="name" required /></label>
          <label>City of origin<input name="cityOrigin" autoComplete="address-level2" placeholder="Davao City" required /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-dark button-full" disabled={loading}>{loading ? 'Saving...' : 'Continue'}</button>
          <p className="form-note">This protects bookings, support cases, and future payouts.</p>
        </form>
        <AuthVisual />
      </div>
    </main>
  );
}
