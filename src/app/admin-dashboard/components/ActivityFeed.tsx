'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActivityItem {
  id: string;
  type: 'movie_approved' | 'movie_rejected' | 'producer_verified' | 'access_blocked' | 'payment_received' | 'movie_submitted' | 'producer_applied';
  title: string;
  detail: string;
  time: string;
  actor?: string;
}

const activityItems: ActivityItem[] = [
  { id: 'act-001', type: 'payment_received', title: 'Payment confirmed', detail: '"Echoes of Basra" — $9.99 by theo.nakamura@gmail.com', time: '2m ago', actor: 'System' },
  { id: 'act-002', type: 'movie_submitted', title: 'New movie submitted', detail: '"The Hollow Meridian" by Soren Blackwell', time: '4m ago', actor: 'Soren Blackwell' },
  { id: 'act-003', type: 'access_blocked', title: 'Re-access attempt blocked', detail: 'Token CGT-8821 — "Fluorescent Nights" — already completed', time: '11m ago', actor: 'System' },
  { id: 'act-004', type: 'producer_applied', title: 'Producer application received', detail: 'Arjun Mehta — Mehta Films (India)', time: '17m ago', actor: 'Arjun Mehta' },
  { id: 'act-005', type: 'movie_approved', title: 'Movie approved', detail: '"Last Signal" by Kwame Asante — now live', time: '34m ago', actor: 'Admin' },
  { id: 'act-006', type: 'access_blocked', title: 'Re-access attempt blocked', detail: 'Token CGT-7743 — "Sector 9 Rising" — already completed', time: '51m ago', actor: 'System' },
  { id: 'act-007', type: 'producer_verified', title: 'Producer verified', detail: 'Maya Rivera — Studio Indigo — can now publish', time: '1h ago', actor: 'Admin' },
  { id: 'act-008', type: 'movie_rejected', title: 'Movie rejected', detail: '"Untitled Horror Short" — content policy violation', time: '2h ago', actor: 'Admin' },
  { id: 'act-009', type: 'payment_received', title: 'Payment confirmed', detail: '"Monsoon Protocol" — $8.99 by sarah.k@outlook.com', time: '2h ago', actor: 'System' },
  { id: 'act-010', type: 'movie_approved', title: 'Movie approved', detail: '"The Cartographer\'s Daughter" — now live', time: '3h ago', actor: 'Admin' },
];

const activityConfig: Record<ActivityItem['type'], { icon: string; iconBg: string; iconColor: string }> = {
  movie_approved: { icon: 'CheckCircleIcon', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  movie_rejected: { icon: 'XCircleIcon', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  producer_verified: { icon: 'CheckBadgeIcon', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  access_blocked: { icon: 'ShieldExclamationIcon', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  payment_received: { icon: 'CreditCardIcon', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  movie_submitted: { icon: 'FilmIcon', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  producer_applied: { icon: 'UserPlusIcon', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
};

export default function ActivityFeed() {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? activityItems : activityItems.slice(0, 6);

  return (
    <div className="card-elevated p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-600 text-foreground">Platform Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live event stream</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-1">
        {displayItems.map((item) => {
          const config = activityConfig[item.type];
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                <Icon
                  name={config.icon as Parameters<typeof Icon>[0]['name']}
                  size={14}
                  className={config.iconColor}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-500 text-foreground leading-tight">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug truncate">{item.detail}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">{item.time}</span>
            </div>
          );
        })}
      </div>

      {activityItems.length > 6 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 w-full py-2 text-xs font-500 text-cinegate-red hover:text-cinegate-red-dark hover:bg-red-50 rounded-lg transition-colors"
        >
          {showAll ? 'Show less' : `Show ${activityItems.length - 6} more events`}
        </button>
      )}
    </div>
  );
}