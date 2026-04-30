'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import type { MovieData } from './MoviePlayerPageClient';

interface CompletionOverlayProps {
  movie: MovieData;
}

export default function CompletionOverlay({ movie }: CompletionOverlayProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitFeedback = () => {
    // Backend integration point: insert into movie_ratings table via Supabase
    setFeedbackSubmitted(true);
  };

  return (
    <div className="w-full aspect-video bg-gray-950 rounded-2xl overflow-hidden relative flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Completed checkmark */}
      <div className="relative z-10 text-center fade-in max-w-lg px-8">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckIcon" size={36} className="text-green-400" />
        </div>

        <h2 className="text-white text-2xl font-700 mb-2">Viewing Complete</h2>
        <p className="text-white/60 text-sm mb-1">
          You have finished watching <span className="text-white font-500">{movie.title}</span>
        </p>
        <p className="text-white/40 text-xs mb-6">
          Your one-time access has been permanently revoked. Token {movie.accessToken} is now inactive.
        </p>

        {/* Access revoked badge */}
        <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-500 px-4 py-2 rounded-full mb-8">
          <Icon name="LockClosedIcon" size={12} />
          Access revoked — re-viewing is not permitted
        </div>

        {/* Star rating */}
        {!feedbackSubmitted ? (
          <div className="mb-6">
            <p className="text-white/50 text-sm mb-3">How would you rate this film?</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`star-${star}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform duration-100 hover:scale-110 active:scale-95"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Icon
                    name="StarIcon"
                    size={28}
                    className={`transition-colors duration-100 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400' :'text-white/20'
                    }`}
                    variant={star <= (hoverRating || rating) ? 'solid' : 'outline'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button
                onClick={handleSubmitFeedback}
                className="btn-primary text-sm px-6 py-2"
              >
                <Icon name="PaperAirplaneIcon" size={14} />
                Submit Rating
              </button>
            )}
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-center gap-2 text-green-400 text-sm">
            <Icon name="CheckCircleIcon" size={16} />
            Thanks for rating — your feedback helps other viewers.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sign-up-login-screen"
            className="btn-secondary text-sm px-5 py-2.5 text-white border-white/20 hover:bg-white/10"
          >
            <Icon name="HomeIcon" size={14} />
            Browse More Films
          </Link>
          <a
            href={`mailto:support@cinegate.io?subject=Access inquiry for ${movie.title}`}
            className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5"
          >
            <Icon name="EnvelopeIcon" size={14} />
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}