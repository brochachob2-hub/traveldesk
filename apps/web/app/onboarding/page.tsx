'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiRequest } from '../lib/api';
import { AuthVisual } from '../components/auth-visual';
import { Logo } from '../components/logo';

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      await apiRequest('/operator/organizations', {
        method: 'POST',
        body: JSON.stringify({
          name: data.get('name'),
          slug: data.get('slug'),
          supportEmail: data.get('supportEmail') || undefined,
          brandColor: data.get('brandColor'),
        }),
      });
      router.push('/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Business setup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell"><div className="auth-layout onboarding-layout">
      <form className="auth-card wide" onSubmit={submit}>
        <Logo />
        <div className="onboarding-progress"><span className="active"/><span/><span/></div>
        <div className="auth-heading"><div className="eyebrow">Step 1 of 3 · Business profile</div><h2>Let&apos;s build your storefront</h2><p>Start with the basics. You can change these anytime.</p></div>
        <label>Business name<input name="name" placeholder="Isla Trails Travel and Tours" required /></label>
        <label>Store URL<input name="slug" placeholder="isla-trails" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><small>Lowercase letters, numbers, and hyphens only.</small></label>
        <label>Support email<input name="supportEmail" type="email" /></label>
        <label>Brand color<input name="brandColor" type="color" defaultValue="#0f766e" /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="button button-dark button-full" disabled={loading}>{loading ? 'Creating…' : 'Continue to tour setup'}</button>
      </form>
      <AuthVisual compact />
    </div></main>
  );
}
