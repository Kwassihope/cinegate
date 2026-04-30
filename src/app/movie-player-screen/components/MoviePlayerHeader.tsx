'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import type { AccessState, MovieData } from './MoviePlayerPageClient';

interface MoviePlayerHeaderProps {
  movie: MovieData;
  accessState: AccessState;
  onDemoStateChange: (state: AccessState) => void;
}

const accessStateLabels: Record<AccessState, string> = {
  active: 'Access Active',
  completed: 'Viewing Completed',
  expired: 'Access Expired',
  invalid: 'Invalid Token',
};

const accessStateBadge: Record<AccessState, 'active' | 'completed' | 'expired' | 'blocked'> = {
  active: 'active',
  completed: 'completed',
  expired: 'expired',
  invalid: 'blocked',
};

export default function MoviePlayerHeader({ movie, accessState, onDemoStateChange }: MoviePlayerHeaderProps) {
  const demoStates: AccessState[] = ['active', 'completed', 'expired', 'invalid'];

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 lg:px-6 xl:px-8 gap-4 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between w-full gap-4">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-4">
          <Link href="/sign-up-login-screen" className="flex items-center gap-2.5 group">
            <AppLogo size={28} />
            <span className="text-white text-base font-600 tracking-tight hidden sm:block group-hover:text-cinegate-red transition-colors">
              CineGate
            </span>
          </Link>
          <div className="hidden sm:block w-px h-5 bg-gray-700" />
          <div className="hidden sm:flex items-center gap-2">
            <Icon name="FilmIcon" size={14} className="text-gray-400" />
            <span className="text-gray-300 text-sm font-500 truncate max-w-48">{movie.title}</span>
          </div>
        </div>

        {/* Center: Access state badge */}
        <div className="flex items-center gap-2">
          <StatusBadge status={accessStateBadge[accessState]} label={accessStateLabels[accessState]} />
          <span className="hidden md:block text-xs font-mono text-gray-500">{movie.accessToken}</span>
        </div>

        {/* Right: Demo state switcher + nav */}
        <div className="flex items-center gap-2">
          {/* Demo state switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <span className="text-xs text-gray-500 px-2">Demo:</span>
            {demoStates.map((state) => (
              <button
                key={`demo-${state}`}
                onClick={() => onDemoStateChange(state)}
                className={`px-2.5 py-1 text-xs font-500 rounded-md transition-all duration-150 ${
                  accessState === state
                    ? 'bg-cinegate-red text-white' :'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          <Link
            href="/admin-dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 text-sm font-500 rounded-lg transition-colors"
          >
            <Icon name="Squares2X2Icon" size={14} />
            <span className="hidden sm:block">Admin</span>
          </Link>

          {/* Viewer avatar */}
          <div className="w-8 h-8 rounded-full bg-cinegate-red flex items-center justify-center text-white text-xs font-600 flex-shrink-0">
            T
          </div>
        </div>
      </div>
    </header>
  );
}