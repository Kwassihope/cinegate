'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  badgeVariant?: 'alert' | 'info' | 'success';
}

interface NavGroup {
  key: string;
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    key: 'group-overview',
    label: 'Overview',
    items: [
      { key: 'nav-dashboard', label: 'Dashboard', icon: 'SquaresIcon', href: '/admin-dashboard' },
    ],
  },
  {
    key: 'group-content',
    label: 'Content',
    items: [
      { key: 'nav-movies', label: 'Movies', icon: 'FilmIcon', href: '/admin-dashboard', badge: 7, badgeVariant: 'alert' },
      { key: 'nav-producers', label: 'Producers', icon: 'UserGroupIcon', href: '/admin-dashboard', badge: 3, badgeVariant: 'alert' },
      { key: 'nav-reviews', label: 'Review Queue', icon: 'ClipboardDocumentCheckIcon', href: '/admin-dashboard', badge: 10, badgeVariant: 'alert' },
      { key: 'nav-submit-movie', label: 'Submit Movie', icon: 'ArrowUpTrayIcon', href: '/submit-movie' },
      { key: 'nav-producer-dashboard', label: 'Producer Dashboard', icon: 'ChartPieIcon', href: '/producer-dashboard' },
    ],
  },
  {
    key: 'group-monetization',
    label: 'Monetization',
    items: [
      { key: 'nav-payments', label: 'Payments', icon: 'CreditCardIcon', href: '/admin-dashboard' },
      { key: 'nav-access', label: 'Access Tokens', icon: 'KeyIcon', href: '/admin-dashboard', badge: 2, badgeVariant: 'info' },
    ],
  },
  {
    key: 'group-platform',
    label: 'Platform',
    items: [
      { key: 'nav-analytics', label: 'Analytics', icon: 'ChartBarIcon', href: '/admin-dashboard' },
      { key: 'nav-settings', label: 'Settings', icon: 'Cog6ToothIcon', href: '/admin-dashboard' },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-screen bg-white border-r border-border sticky top-0 z-30"
      style={{
        width: collapsed ? '64px' : '240px',
        transition: 'width 300ms ease',
        minWidth: collapsed ? '64px' : '240px',
      }}
    >
      {/* Logo area */}
      <div
        className="flex items-center h-16 border-b border-border"
        style={{
          padding: collapsed ? '0 12px' : '0 20px',
          transition: 'padding 300ms ease',
          overflow: 'hidden',
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AppLogo size={32} />
          {!collapsed && (
            <span
              className="font-semibold text-base text-cinegate-navy tracking-tight truncate"
              style={{ transition: 'opacity 200ms ease', opacity: collapsed ? 0 : 1 }}
            >
              CineGate
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3" style={{ padding: collapsed ? '12px 8px' : '12px 12px' }}>
        {navGroups.map((group) => (
          <div key={group.key} className="mb-4">
            {!collapsed && (
              <p className="text-xs font-500 text-muted-foreground uppercase tracking-widest mb-1.5 px-2">
                {group.label}
              </p>
            )}
            {collapsed && <div className="border-t border-border mb-2 mx-1" />}

            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.key} className="tooltip-wrapper mb-0.5">
                  <Link
                    href={item.href}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    style={{
                      padding: collapsed ? '10px 8px' : '10px 14px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                  >
                    <Icon
                      name={item.icon as Parameters<typeof Icon>[0]['name']}
                      size={20}
                      className="flex-shrink-0"
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-xs font-600 px-1.5 py-0.5 rounded-full tabular-nums ${
                          item.badgeVariant === 'alert' ?'bg-red-100 text-red-600'
                            : item.badgeVariant === 'success' ?'bg-green-100 text-green-600' :'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cinegate-red" />
                    )}
                  </Link>
                  {collapsed && (
                    <span className="tooltip-label">{item.label}{item.badge ? ` (${item.badge})` : ''}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: user + toggle */}
      <div className="border-t border-border" style={{ padding: collapsed ? '12px 8px' : '12px 12px' }}>
        {/* User profile */}
        <div
          className="flex items-center gap-3 mb-2 rounded-lg p-2 hover:bg-muted cursor-pointer transition-colors"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-8 h-8 rounded-full bg-cinegate-red flex items-center justify-center text-white text-sm font-600 flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-500 text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@cinegate.io</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 text-sm font-500"
        >
          <Icon
            name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
            size={16}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}