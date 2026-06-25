'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AuthVisual } from '../components/auth-visual';
import { FederatedAuth } from '../components/federated-auth';
import { Logo } from '../components/logo';
import { apiRequest } from '../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: data.get('fullName'),
          cityOrigin: data.get('cityOrigin'),
          email: data.get('email'),
          password: data.get('password'),
        }),
      });
      router.push('/onboarding');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Registration failed');
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
            <div className="eyebrow">Start free</div>
            <h2>Build your travel brand</h2>
            <p>Full name and city of origin are required for trust and support.</p>
          </div>
          <div className="form-row">
            <label>Full name<input name="fullName" autoComplete="name" required /></label>
            <label>City of origin<input name="cityOrigin" autoComplete="address-level2" placeholder="Cebu City" required /></label>
          </div>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" minLength={10} autoComplete="new-password" required /><small>At least 10 characters with a letter and number.</small></label>
          {error && <p className="form-error">{error}</p>}
          <label className="checkbox-label terms-check"><input type="checkbox" required /> I agree to the Terms and Privacy Policy.</label>
          <button className="button button-dark button-full" disabled={loading}>{loading ? 'Creating...' : 'Create my account'}</button>
          <FederatedAuth nextPath="/onboarding" />
          <p>Already registered? <Link className="text-link" href="/login">Sign in</Link></p>
        </form>
        <AuthVisual />
      </div>
    </main>
  );
}
