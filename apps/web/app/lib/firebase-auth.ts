'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  setPersistence,
  signInWithPhoneNumber,
  signInWithPopup,
  type Auth,
  type ConfirmationResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let authInstance: Auth | null = null;
let persistenceReady = false;

export function hasFirebaseAuthConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
}

export function getFirebaseAuth() {
  if (!hasFirebaseAuthConfig()) {
    throw new Error('Firebase sign-in is not configured yet');
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance ??= getAuth(app);

  if (!persistenceReady) {
    persistenceReady = true;
    void setPersistence(authInstance, browserLocalPersistence);
  }

  return authInstance;
}

export async function signInWithSocialProvider(providerName: 'google' | 'facebook') {
  const auth = getFirebaseAuth();
  const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
  provider.addScope('email');

  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken(true);
}

export function createPhoneVerifier(containerId: string) {
  return new RecaptchaVerifier(getFirebaseAuth(), containerId, { size: 'invisible' });
}

export async function startPhoneSignIn(phoneNumber: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(getFirebaseAuth(), phoneNumber, verifier);
}
