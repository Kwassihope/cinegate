import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'CineGate — Pay-Per-View Movies for Independent Filmmakers',
  description: 'CineGate lets independent producers monetize films with one-time pay-per-view access links — admin-approved content, secure payments, and strict single-viewing enforcement.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: '0.9375rem',
            },
            duration: 3500,
          }}
          richColors
        />
</body>
    </html>
  );
}