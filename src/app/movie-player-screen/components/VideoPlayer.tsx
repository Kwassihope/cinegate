'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { MovieData } from './MoviePlayerPageClient';

interface VideoPlayerProps {
  movie: MovieData;
  onComplete: () => void;
  onStart: () => void;
  hasStarted: boolean;
}

export default function VideoPlayer({ movie, onComplete, onStart, hasStarted }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [completionWarningShown, setCompletionWarningShown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = movie.durationSeconds;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Simulate video progress
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= totalDuration) {
            clearInterval(progressTimerRef.current!);
            setIsPlaying(false);
            // Backend integration point: call Supabase to mark ViewerAccess as completed
            setTimeout(() => onComplete(), 800);
            return totalDuration;
          }
          // Show warning at 95% completion
          if (next >= totalDuration * 0.95 && !completionWarningShown) {
            setCompletionWarningShown(true);
          }
          return next;
        });
      }, 100); // Accelerated for demo (1s real = 100ms demo)
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, totalDuration, onComplete, completionWarningShown]);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isPlaying, resetControlsTimer]);

  const handlePlayPause = () => {
    if (!hasStarted) {
      onStart();
    }
    setIsPlaying((v) => !v);
    setIsBuffering(true);
    setTimeout(() => setIsBuffering(false), 600);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime((val / 100) * totalDuration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    setIsMuted((v) => !v);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((v) => !v);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const remainingTime = totalDuration - currentTime;

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-2xl overflow-hidden group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video'
      }`}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* Video mock — cinematic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center">
        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Movie title card */}
        {!hasStarted && (
          <div className="text-center z-10 fade-in">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={handlePlayPause}
            >
              <Icon name="PlayIcon" size={32} className="text-white ml-1" />
            </div>
            <h2 className="text-white text-2xl font-700 mb-2">{movie.title}</h2>
            <p className="text-white/60 text-sm">{movie.producer} · {movie.duration} · {movie.language}</p>
            <p className="text-amber-400 text-xs mt-4 font-500">
              ⚠ One-time access — viewing begins when you press play
            </p>
          </div>
        )}

        {/* Playing state visual */}
        {hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isBuffering && (
              <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            )}
            {!isPlaying && !isBuffering && (
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-80">
                <Icon name="PauseIcon" size={24} className="text-white" />
              </div>
            )}
          </div>
        )}

        {/* Completion warning overlay */}
        {completionWarningShown && progressPercent < 100 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm border border-amber-500/50 text-amber-300 text-xs font-500 px-4 py-2 rounded-full slide-up">
            <Icon name="ExclamationTriangleIcon" size={12} className="inline mr-1.5" />
            Approaching end — access will be revoked on completion
          </div>
        )}
      </div>

      {/* Progress bar track (always visible, thin) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-cinegate-red transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

        {/* Controls bar */}
        <div className="relative z-10 px-4 pb-4 pt-2">
          {/* Seek bar */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={100}
              value={progressPercent}
              onChange={handleSeek}
              className="video-progress-bar w-full"
              style={{
                background: `linear-gradient(to right, #e94560 ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%)`,
              }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-150 active:scale-95 flex-shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <Icon name={isPlaying ? 'PauseIcon' : 'PlayIcon'} size={16} />
            </button>

            {/* Skip forward */}
            <button
              onClick={() => setCurrentTime((t) => Math.min(t + 10, totalDuration))}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <Icon name="ForwardIcon" size={16} />
            </button>

            {/* Volume */}
            <div
              className="flex items-center gap-2 relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="text-white/70 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <Icon
                  name={isMuted || volume === 0 ? 'SpeakerXMarkIcon' : volume < 0.5 ? 'SpeakerWaveIcon' : 'SpeakerWaveIcon'}
                  size={16}
                />
              </button>
              <div className={`transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  style={{
                    background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.4) ${(isMuted ? 0 : volume) * 100}%)`,
                  }}
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-white/70 text-xs font-mono flex-1">
              <span className="tabular-nums">{formatTime(currentTime)}</span>
              <span className="text-white/30">/</span>
              <span className="tabular-nums">{formatTime(totalDuration)}</span>
              <span className="ml-2 text-white/40">-{formatTime(remainingTime)}</span>
            </div>

            {/* Quality badge */}
            <span className="text-xs font-600 text-white/50 bg-white/10 px-2 py-0.5 rounded hidden sm:block">
              HD
            </span>

            {/* One-time access indicator */}
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-500 bg-amber-950/60 px-2.5 py-1 rounded-full hidden md:flex">
              <Icon name="LockClosedIcon" size={10} />
              One-time
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors ml-auto"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <Icon name={isFullscreen ? 'ArrowsPointingInIcon' : 'ArrowsPointingOutIcon'} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}