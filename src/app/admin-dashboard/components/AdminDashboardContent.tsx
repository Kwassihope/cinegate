'use client';

import React, { useState } from 'react';
import AdminTopbar from './AdminTopbar';
import KPIBentoGrid from './KPIBentoGrid';
import PendingMoviesTable from './PendingMoviesTable';
import PendingProducersTable from './PendingProducersTable';
import AdminCharts from './AdminCharts';
import ActivityFeed from './ActivityFeed';

export type DashboardTab = 'overview' | 'movies' | 'producers' | 'analytics';

export default function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [lastUpdated] = useState('Apr 27, 2026 — 12:14 PM');

  const tabs: { key: DashboardTab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'movies', label: 'Pending Movies', count: 7 },
    { key: 'producers', label: 'Pending Producers', count: 3 },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminTopbar lastUpdated={lastUpdated} />

      {/* Page header */}
      <div className="px-6 lg:px-8 xl:px-10 pt-6 pb-4 border-b border-border bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-700 text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Platform overview — content approvals, access monitoring, and revenue tracking
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
              Live data
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 -mb-px">
            {tabs.map((tab) => (
              <button
                key={`tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-500 border-b-2 transition-all duration-150 rounded-t-lg ${
                  activeTab === tab.key
                    ? 'border-cinegate-red text-cinegate-red bg-red-50/50' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full tabular-nums font-600 ${
                      activeTab === tab.key
                        ? 'bg-cinegate-red text-white' :'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 lg:px-8 xl:px-10 py-6 bg-background">
        <div className="max-w-screen-2xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6 fade-in">
              <KPIBentoGrid />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <AdminCharts />
                </div>
                <div>
                  <ActivityFeed />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'movies' && (
            <div className="fade-in">
              <PendingMoviesTable />
            </div>
          )}
          {activeTab === 'producers' && (
            <div className="fade-in">
              <PendingProducersTable />
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="fade-in">
              <AdminCharts fullView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}