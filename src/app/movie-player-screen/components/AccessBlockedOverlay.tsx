'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import type { AccessState, MovieData } from './MoviePlayerPageClient';

interface AccessBlockedOverlayProps {
  accessState: AccessState;
  movie: MovieData;
}

const stateConfig: Record<Exclude<AccessState, 'active' | 'completed'>, {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}> = {
  expired: {
    icon: 'ClockIcon',
    iconBg: 'bg-amber-950/40',
    iconColor: 'text-amber-400',
    title: 'Access Link Expired',
    subtitle: 'Your payment link has passed its validity window',
    description: 'Pay-per-view access links are valid for 24 hours from the time of purchase. This link has expired without being used. To watch this film, please purchase a new access link.',
    ctaLabel: 'Purchase New Access',
    ctaHref: '/sign-up-login-screen',
  },
  invalid: {
    icon: 'ShieldExclamationIcon',
    iconBg: 'bg-red-950/40',
    iconColor: 'text-red-400',
    title: 'Invalid Access Token',
    subtitle: 'This token could not be verified',
    description: 'The access token in this link is invalid, has already been used, or does not exist in our system. If you believe this is an error, please contact CineGate support with your payment confirmation.',
    ctaLabel: 'Contact Support',
    ctaHref: 'mailto:support@cinegate.io',
  },
};

export default function AccessBlockedOverlay({ accessState, movie }: AccessBlockedOverlayProps) {
  if (accessState === 'active' || accessState === 'completed') return null;

  const config = stateConfig[accessState];

  return (
    <div className="w-full aspect-video bg-gray-950 rounded-2xl overflow-hidden relative flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Content */}
      <div className="relative z-10 text-center fade-in max-w-md px-8">
        <div className={`w-20 h-20 rounded-full ${config.iconBg} border border-white/10 flex items-center justify-center mx-auto mb-6`}>
          <Icon name={config.icon as Parameters<typeof Icon>[0]['name']} size={36} className={config.iconColor} />
        </div>

        <h2 className="text-white text-2xl font-700 mb-2">{config.title}</h2>
        <p className="text-white/50 text-sm mb-4">{config.subtitle}</p>
        <p className="text-white/40 text-xs leading-relaxed mb-6">{config.description}</p>

        {/* Token info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/30 mb-0.5">Movie</p>
              <p className="text-xs font-500 text-white/70">{movie.title}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-0.5">Token</p>
              <p className="text-xs font-mono text-white/50">{movie.accessToken}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-0.5">Status</p>
              <p className={`text-xs font-600 ${accessState === 'expired' ? 'text-amber-400' : 'text-red-400'}`}>
                {accessState === 'expired' ? 'Expired' : 'Invalid / Used'}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-0.5">Viewer</p>
              <p className="text-xs text-white/50 truncate">{movie.viewerEmail}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={config.ctaHref}
            className="btn-primary text-sm px-5 py-2.5"
          >
            <Icon name={accessState === 'expired' ? 'CreditCardIcon' : 'EnvelopeIcon'} size={14} />
            {config.ctaLabel}
          </Link>
          <Link
            href="/sign-up-login-screen"
            className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5"
          >
            <Icon name="HomeIcon" size={14} />
            Back to CineGate
          </Link>
        </div>
      </div>
    </div>
  );
}