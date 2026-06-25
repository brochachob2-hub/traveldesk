'use client';

import { useRouter } from 'next/navigation';
import { useId, useRef, useState } from 'react';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { apiRequest } from '../lib/api';
import {
  createPhoneVerifier,
  hasFirebaseAuthConfig,
  signInWithSocialProvider,
  startPhoneSignIn,
} from '../lib/firebase-auth';

type FederatedAuthProps = {
  nextPath: string;
};

type FederatedResponse = {
  profileComplete: boolean;
};

export function FederatedAuth({ nextPath }: FederatedAuthProps) {
  const router = useRouter();
  const recaptchaId = useId().replace(/:/g, '');
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<'google' | 'facebook' | 'phone' | 'code' | null>(null);
  const [error, setError] = useState('');
  const configured = hasFirebaseAuthConfig();
  const facebookEnabled = process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH === 'true';

  async function finishWithIdToken(idToken: string) {
    const result = await apiRequest<FederatedResponse>('/auth/federated', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    router.push(result.profileComplete ? nextPath : `/complete-profile?next=${encodeURIComponent(nextPath)}`);
  }

  async function social(provider: 'google' | 'facebook') {
    setLoading(provider);
    setError('');
    try {
      const idToken = await signInWithSocialProvider(provider);
      await finishWithIdToken(idToken);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign-in failed');
    } finally {
      setLoading(null);
    }
  }

  async function sendSms() {
    setLoading('phone');
    setError('');
    try {
      verifierRef.current ??= createPhoneVerifier(recaptchaId);
      setConfirmation(await startPhoneSignIn(phone.trim(), verifierRef.current));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not send SMS code');
    } finally {
      setLoading(null);
    }
  }

  async function confirmSms() {
    if (!confirmation) return;
    setLoading('code');
    setError('');
    try {
      const result = await confirmation.confirm(code.trim());
      await finishWithIdToken(await result.user.getIdToken(true));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Invalid SMS code');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="federated-auth">
      <div className="auth-divider"><span>or continue with</span></div>
      <div className="provider-grid">
        <button type="button" className="provider-button google" disabled={!configured || Boolean(loading)} onClick={() => social('google')}>
          <span>G</span>{loading === 'google' ? 'Connecting...' : 'Google'}
        </button>
        <button type="button" className="provider-button facebook" disabled={!configured || !facebookEnabled || Boolean(loading)} onClick={() => social('facebook')}>
          <span>f</span>{facebookEnabled && loading === 'facebook' ? 'Connecting...' : 'Facebook later'}
        </button>
      </div>

      <div className="phone-auth">
        <label>
          Mobile number
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+639171234567"
            autoComplete="tel"
            disabled={!configured || Boolean(confirmation)}
            required
          />
        </label>
        {confirmation && (
          <label>
            SMS code
            <input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" required />
          </label>
        )}
        <button type="button" className="button button-ghost button-full" disabled={!configured || Boolean(loading)} onClick={confirmation ? confirmSms : sendSms}>
          {confirmation ? (loading === 'code' ? 'Verifying...' : 'Verify code') : loading === 'phone' ? 'Sending...' : 'Send SMS code'}
        </button>
        <div id={recaptchaId} />
      </div>

      {!configured && <p className="form-note">Add Firebase web keys in .env to enable Google and mobile login.</p>}
      {configured && !facebookEnabled && <p className="form-note">Facebook login needs a Meta app first. Google and mobile are ready to test.</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
