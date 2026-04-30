'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import type { AccessState, MovieData } from './MoviePlayerPageClient';

interface MovieMetadataPanelProps {
  movie: MovieData;
  accessState: AccessState;
  hasStarted: boolean;
}

type PanelTab = 'details' | 'access' | 'producer';

export default function MovieMetadataPanel({ movie, accessState, hasStarted }: MovieMetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('details');

  const tabs: { key: PanelTab; label: string; icon: string }[] = [
    { key: 'details', label: 'Details', icon: 'InformationCircleIcon' },
    { key: 'access', label: 'Access', icon: 'KeyIcon' },
    { key: 'producer', label: 'Producer', icon: 'VideoCameraIcon' },
  ];

  const accessBadgeStatus = accessState === 'active' ? 'active' : accessState === 'completed' ? 'completed' : 'expired';

  return (
    <div className="flex flex-col gap-4">
      {/* Access status card */}
      <div className={`rounded-2xl border p-4 ${
        accessState === 'active' ?'bg-green-950/40 border-green-800/40'
          : accessState === 'completed' ?'bg-purple-950/40 border-purple-800/40' :'bg-red-950/40 border-red-800/40'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-600 text-gray-400 uppercase tracking-wider">Access Status</p>
          <StatusBadge
            status={accessBadgeStatus}
            label={
              accessState === 'active' ? (hasStarted ? 'Watching' : 'Ready') :
              accessState === 'completed' ? 'Revoked' :
              accessState === 'expired' ? 'Expired' : 'Invalid'
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Token</span>
            <span className="text-xs font-mono text-gray-300">{movie.accessToken}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Viewer</span>
            <span className="text-xs text-gray-300 truncate max-w-36">{movie.viewerEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Purchased</span>
            <span className="text-xs text-gray-300">{movie.purchasedAt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Expires</span>
            <span className="text-xs text-gray-300">{movie.accessExpiresAt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Price paid</span>
            <span className="text-xs font-600 text-green-400">{movie.price}</span>
          </div>
        </div>

        {/* One-time enforcement visual */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1.5 rounded-full ${
              accessState === 'active' ? 'bg-green-900' : 'bg-gray-800'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  accessState === 'active' ? 'bg-green-500' :
                  accessState === 'completed'? 'bg-purple-500 w-full' : 'bg-red-500 w-0'
                }`}
                style={{ width: accessState === 'active' ? (hasStarted ? '45%' : '5%') : undefined }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {accessState === 'active' ? (hasStarted ? 'In progress' : 'Not started') :
               accessState === 'completed' ? 'Completed' : 'Unavailable'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
            <Icon name="ShieldCheckIcon" size={10} />
            One-time viewing enforced
          </p>
        </div>
      </div>

      {/* Tabbed metadata panel */}
      <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
        {/* Tab nav */}
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={`panel-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-500 transition-all duration-150 ${
                activeTab === tab.key
                  ? 'text-white border-b-2 border-cinegate-red bg-gray-800/50' :'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              <Icon name={tab.icon as Parameters<typeof Icon>[0]['name']} size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4">
          {activeTab === 'details' && (
            <div className="space-y-4 fade-in">
              <div>
                <h3 className="text-white font-600 text-base leading-tight mb-1">{movie.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400">{movie.releaseYear}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-400">{movie.duration}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs font-600 border border-gray-700 text-gray-400 px-1.5 py-0.5 rounded">{movie.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-cinegate-red/20 text-cinegate-red px-2.5 py-1 rounded-full font-500">{movie.genre}</span>
                <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">{movie.language}</span>
              </div>

              <div>
                <p className="text-xs font-600 text-gray-500 uppercase tracking-wider mb-2">Synopsis</p>
                <p className="text-sm text-gray-300 leading-relaxed">{movie.synopsis}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
                {[
                  { key: 'meta-duration', label: 'Duration', value: movie.duration },
                  { key: 'meta-language', label: 'Language', value: movie.language },
                  { key: 'meta-rating', label: 'Rating', value: movie.rating },
                  { key: 'meta-genre', label: 'Genre', value: movie.genre },
                ].map((meta) => (
                  <div key={meta.key}>
                    <p className="text-xs text-gray-600 mb-0.5">{meta.label}</p>
                    <p className="text-xs font-500 text-gray-300">{meta.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-4 fade-in">
              <div>
                <p className="text-xs font-600 text-gray-500 uppercase tracking-wider mb-3">Access Token Details</p>
                <div className="bg-gray-800 rounded-xl p-3 font-mono text-sm text-cinegate-red border border-gray-700 break-all">
                  {movie.accessToken}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'access-viewer', label: 'Issued to', value: movie.viewerEmail, mono: true },
                  { key: 'access-movie', label: 'Movie ID', value: movie.id, mono: true },
                  { key: 'access-purchased', label: 'Purchased at', value: movie.purchasedAt, mono: false },
                  { key: 'access-expires', label: 'Link expires', value: movie.accessExpiresAt, mono: false },
                  { key: 'access-price', label: 'Amount paid', value: movie.price, mono: false },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-600">{item.label}</p>
                    <p className={`text-xs text-gray-300 ${item.mono ? 'font-mono' : 'font-500'}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Icon name="ExclamationTriangleIcon" size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-600 text-amber-300 mb-1">One-Time Access Policy</p>
                    <p className="text-xs text-amber-400/70 leading-relaxed">
                      This access token is single-use. Once the movie is viewed to completion, this token is permanently revoked and cannot be reactivated. No refunds are issued after viewing begins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'producer' && (
            <div className="space-y-4 fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cinegate-navy to-cinegate-deep flex items-center justify-center text-white font-700 text-lg flex-shrink-0">
                  {movie.producer.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-600 text-sm">{movie.producer}</p>
                  <p className="text-gray-400 text-xs">{movie.producerCompany}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="CheckBadgeIcon" size={12} className="text-green-400" />
                    <span className="text-xs text-green-400 font-500">Verified Producer</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <p className="text-xs font-600 text-gray-500 uppercase tracking-wider mb-2">About</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {movie.producerCompany} is an independent film production company known for authentic storytelling and culturally rich narratives.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Films on platform</p>
                  <p className="text-sm font-600 text-white tabular-nums">4</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Avg. rating</p>
                  <p className="text-sm font-600 text-amber-400 tabular-nums">4.6 ★</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Total views</p>
                  <p className="text-sm font-600 text-white tabular-nums">1,847</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Completion rate</p>
                  <p className="text-sm font-600 text-green-400 tabular-nums">78.3%</p>
                </div>
              </div>

              <button className="w-full py-2.5 text-xs font-600 text-cinegate-red bg-red-950/40 hover:bg-red-950/60 border border-red-900/40 rounded-xl transition-colors">
                View All Films by {movie.producer.split(' ')[0]}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Support link */}
      <div className="text-center">
        <a
          href="mailto:support@cinegate.io"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1.5"
        >
          <Icon name="QuestionMarkCircleIcon" size={12} />
          Need help? Contact CineGate support
        </a>
      </div>
    </div>
  );
}