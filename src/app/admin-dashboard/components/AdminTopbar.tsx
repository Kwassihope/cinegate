'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface AdminTopbarProps {
  lastUpdated: string;
}

export default function AdminTopbar({ lastUpdated }: AdminTopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 lg:px-8 xl:px-10 gap-4 sticky top-0 z-20">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between w-full gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Icon
            name="MagnifyingGlassIcon"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, producers, access tokens…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-transparent rounded-lg focus:bg-white focus:border-cinegate-red/40 focus:outline-none focus:ring-2 focus:ring-cinegate-red/10 transition-all duration-150 placeholder:text-muted-foreground"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono bg-white border border-border rounded px-1.5 py-0.5 hidden sm:block">
            ⌘K
          </kbd>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Last updated */}
          <span className="text-xs text-muted-foreground hidden xl:block">
            Updated {lastUpdated}
          </span>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
              aria-label="Notifications"
            >
              <Icon name="BellIcon" size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cinegate-red border-2 border-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 bg-white border border-border rounded-xl shadow-card-lg z-50 scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-600 text-foreground">Notifications</p>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="XMarkIcon" size={14} />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { key: 'notif-1', icon: 'FilmIcon', color: 'text-blue-600 bg-blue-50', text: 'New movie submitted: "The Hollow Meridian"', time: '4m ago' },
                    { key: 'notif-2', icon: 'UserPlusIcon', color: 'text-green-600 bg-green-50', text: 'Producer "Arjun Mehta Films" awaiting verification', time: '17m ago' },
                    { key: 'notif-3', icon: 'ShieldExclamationIcon', color: 'text-red-600 bg-red-50', text: '2 re-access attempts blocked this hour', time: '1h ago' },
                    { key: 'notif-4', icon: 'CreditCardIcon', color: 'text-purple-600 bg-purple-50', text: 'Payment confirmed for "Echoes of Basra"', time: '2h ago' },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                        <Icon name={notif.icon as Parameters<typeof Icon>[0]['name']} size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">{notif.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border">
                  <button className="text-xs text-cinegate-red font-500 hover:text-cinegate-red-dark transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <Link
            href="/movie-player-screen"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cinegate-navy text-white text-sm font-500 rounded-lg hover:bg-cinegate-blue transition-colors"
          >
            <Icon name="PlayIcon" size={14} />
            <span className="hidden sm:block">Test Player</span>
          </Link>
        </div>
      </div>
    </header>
  );
}