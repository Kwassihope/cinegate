'use client';

import React, { useState } from 'react';
import MoviePlayerHeader from './MoviePlayerHeader';
import VideoPlayer from './VideoPlayer';
import MovieMetadataPanel from './MovieMetadataPanel';
import AccessBlockedOverlay from './AccessBlockedOverlay';
import CompletionOverlay from './CompletionOverlay';

export type AccessState = 'active' | 'completed' | 'expired' | 'invalid';

export interface MovieData {
  id: string;
  title: string;
  producer: string;
  producerCompany: string;
  genre: string;
  duration: string;
  durationSeconds: number;
  language: string;
  rating: string;
  synopsis: string;
  releaseYear: number;
  price: string;
  accessToken: string;
  viewerEmail: string;
  purchasedAt: string;
  accessExpiresAt: string;
}

const mockMovie: MovieData = {
  id: 'movie-002',
  title: 'Echoes of Basra',
  producer: 'Layla Al-Rashidi',
  producerCompany: 'Desert Lens Cinema',
  genre: 'Drama',
  duration: '2h 04m',
  durationSeconds: 7440,
  language: 'Arabic',
  rating: 'PG-13',
  synopsis: 'A family separated by war reconnects through letters discovered 30 years later. Following the journey of a daughter who inherits a suitcase of unopened correspondence, this deeply moving film explores memory, loss, and the enduring power of love across borders.',
  releaseYear: 2026,
  price: '$9.99',
  accessToken: 'CGT-7834-XKPL-9201',
  viewerEmail: 'theo.nakamura@gmail.com',
  purchasedAt: 'Apr 27, 2026 at 11:42 AM',
  accessExpiresAt: 'Apr 27, 2026 at 11:59 PM',
};

export default function MoviePlayerPageClient() {
  // Cycle through states for demo: active → completed → expired → invalid
  const [accessState, setAccessState] = useState<AccessState>('active');
  const [hasStartedWatching, setHasStartedWatching] = useState(false);

  const handleVideoComplete = () => {
    // Backend integration point: mark ViewerAccess as completed via Supabase, revoke token
    setAccessState('completed');
  };

  const handleStartWatching = () => {
    // Backend integration point: update ViewerAccess.viewing_started_at in Supabase
    setHasStartedWatching(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <MoviePlayerHeader
        movie={mockMovie}
        accessState={accessState}
        onDemoStateChange={setAccessState}
      />

      <div className="flex-1 flex flex-col xl:flex-row max-w-screen-2xl mx-auto w-full px-4 lg:px-6 xl:px-8 py-6 gap-6">
        {/* Main player area */}
        <div className="flex-1 min-w-0">
          {/* Viewing in progress banner */}
          {hasStartedWatching && accessState === 'active' && (
            <div className="flex items-center gap-2.5 bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-500 px-4 py-2.5 rounded-xl mb-4">
              <Icon name="ExclamationTriangleIcon" size={14} />
              <span>
                <strong>One-time access:</strong> This movie can only be watched once. Your access will be permanently revoked upon completion.
              </span>
            </div>
          )}

          {/* Player or overlay */}
          {accessState === 'active' ? (
            <VideoPlayer
              movie={mockMovie}
              onComplete={handleVideoComplete}
              onStart={handleStartWatching}
              hasStarted={hasStartedWatching}
            />
          ) : accessState === 'completed' ? (
            <CompletionOverlay movie={mockMovie} />
          ) : (
            <AccessBlockedOverlay accessState={accessState} movie={mockMovie} />
          )}
        </div>

        {/* Metadata panel */}
        <div className="xl:w-80 2xl:w-96 flex-shrink-0">
          <MovieMetadataPanel
            movie={mockMovie}
            accessState={accessState}
            hasStarted={hasStartedWatching}
          />
        </div>
      </div>
    </div>
  );
}

// Local Icon import for this file
function Icon({ name, size, className }: { name: string; size: number; className?: string }) {
  // Re-export from AppIcon
  const AppIcon = require('@/components/ui/AppIcon').default;
  return <AppIcon name={name} size={size} className={className} />;
}