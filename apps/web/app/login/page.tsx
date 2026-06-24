'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiRequest } from '../lib/api';
import { AuthVisual } from '../components/auth-visual';
import { Logo } from '../components/logo';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
      });
      router.push('/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell"><div className="auth-layout">
      <form className="auth-card" onSubmit={submit}>
        <Logo />
        <div className="auth-heading"><div className="eyebrow">Welcome back</div><h2>Sign in to TravelDesk</h2><p>Manage bookings, tours, and your storefront.</p></div>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p className="form-error">{error}</p>}
        <div className="form-between"><label className="checkbox-label"><input type="checkbox"/> Remember me</label><a>Forgot password?</a></div>
        <button className="button button-dark button-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        <p>New business? <Link className="text-link" href="/register">Create an account</Link></p>
      </form><AuthVisual />
    </div></main>
  );
}
