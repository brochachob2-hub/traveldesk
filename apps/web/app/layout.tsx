import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ServiceWorkerRegistration } from './service-worker-registration';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'TravelDesk', template: '%s | TravelDesk' },
  description: 'Branded booking and operations software for travel businesses.',
  manifest: '/manifest.webmanifest',
  icons: [
    { rel: 'icon', url: '/icon.svg' },
    { rel: 'apple-touch-icon', url: '/apple-icon-180.png', sizes: '180x180' },
  ],
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = { themeColor: '#0F766E' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
