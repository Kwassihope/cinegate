'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface KPICardData {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  icon: string;
  iconBg: string;
  iconColor: string;
  cardVariant?: 'default' | 'alert' | 'success' | 'info';
  colSpan?: 'col-span-1' | 'col-span-2';
  description?: string;
}

const kpiData: KPICardData[] = [
  {
    id: 'kpi-pending',
    label: 'Pending Approvals',
    value: '10',
    subValue: '7 movies + 3 producers',
    change: '+3 since yesterday',
    changeDirection: 'up',
    icon: 'ClockIcon',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    cardVariant: 'alert',
    colSpan: 'col-span-2',
    description: 'Requires immediate review',
  },
  {
    id: 'kpi-revenue',
    label: 'Total Platform Revenue',
    value: '$24,831',
    subValue: 'This month',
    change: '+18.4% vs last month',
    changeDirection: 'up',
    icon: 'BanknotesIcon',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    cardVariant: 'success',
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-active-views',
    label: 'Active Views Today',
    value: '147',
    subValue: 'Unique access sessions',
    change: '+22 vs yesterday',
    changeDirection: 'up',
    icon: 'EyeIcon',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    cardVariant: 'info',
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-completion',
    label: 'Completion Rate',
    value: '73.2%',
    subValue: 'Of all purchased accesses',
    change: '-2.1% vs last week',
    changeDirection: 'down',
    icon: 'CheckCircleIcon',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    cardVariant: 'default',
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-producers',
    label: 'Verified Producers',
    value: '38',
    subValue: 'Active on platform',
    change: '+2 this week',
    changeDirection: 'up',
    icon: 'VideoCameraIcon',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    cardVariant: 'default',
    colSpan: 'col-span-1',
  },
  {
    id: 'kpi-movies',
    label: 'Published Movies',
    value: '214',
    subValue: 'Live & purchasable',
    change: '+11 this month',
    changeDirection: 'up',
    icon: 'FilmIcon',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    cardVariant: 'default',
    colSpan: 'col-span-1',
  },
];

const variantStyles: Record<string, string> = {
  default: 'bg-white border-border',
  alert: 'bg-red-50 border-red-200',
  success: 'bg-green-50/50 border-green-200',
  info: 'bg-blue-50/50 border-blue-200',
};

export default function KPIBentoGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-600 text-foreground">Platform Health</h2>
        <span className="text-xs text-muted-foreground">Apr 27, 2026</span>
      </div>
      {/* Grid plan: 6 cards → grid-cols-4
          Row 1: hero "Pending Approvals" spans 2 cols + "Revenue" + "Active Views"  (2+1+1 = 4)
          Row 2: "Completion Rate" + "Verified Producers" + "Published Movies" + empty → last 3 each col-span-1 on 4-col grid (3 cards = 3 cols, last col empty → hero spans 2 to fill)
          Revised: 6 cards → 4-col grid
          Row 1: Pending(2) + Revenue(1) + ActiveViews(1) = 4
          Row 2: Completion(1) + Producers(1) + Movies(1) + spacer → no orphan since 3 cols filled
          Use 3-col for row2 to avoid orphan: switch to 4-col where row2 has last card span-2
          Final: Pending(col-span-2) + Revenue + ActiveViews = row1 4-col
                 Completion + Producers + Movies(col-span-2) = row2 4-col  ✓ no orphan
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {/* Row 1 */}
        {/* Pending Approvals — hero, col-span-2, alert */}
        <div
          className={`rounded-xl border p-5 ${variantStyles['alert']} col-span-1 sm:col-span-2 lg:col-span-2`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-500 text-red-700 uppercase tracking-wider mb-0.5">
                Pending Approvals
              </p>
              <p className="text-xs text-red-600">Requires immediate review</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Icon name="ClockIcon" size={20} className="text-red-600" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-700 text-red-700 tabular-nums leading-none">10</p>
            <div className="pb-1">
              <p className="text-sm font-500 text-red-600">7 movies + 3 producers</p>
              <p className="text-xs text-red-500 flex items-center gap-1">
                <Icon name="ArrowUpIcon" size={10} />
                +3 since yesterday
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-red-200 flex gap-2">
            <button className="flex-1 py-1.5 text-xs font-600 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
              Review Movies
            </button>
            <button className="flex-1 py-1.5 text-xs font-600 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
              Review Producers
            </button>
          </div>
        </div>

        {/* Revenue */}
        <div className={`rounded-xl border p-5 ${variantStyles['success']}`}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <Icon name="BanknotesIcon" size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">$24,831</p>
          <p className="text-xs text-muted-foreground mb-1">This month</p>
          <p className="text-xs text-green-600 font-500 flex items-center gap-1">
            <Icon name="ArrowTrendingUpIcon" size={12} />
            +18.4% vs last month
          </p>
        </div>

        {/* Active Views */}
        <div className={`rounded-xl border p-5 ${variantStyles['info']}`}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Active Views Today</p>
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Icon name="EyeIcon" size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">147</p>
          <p className="text-xs text-muted-foreground mb-1">Unique sessions</p>
          <p className="text-xs text-blue-600 font-500 flex items-center gap-1">
            <Icon name="ArrowTrendingUpIcon" size={12} />
            +22 vs yesterday
          </p>
        </div>

        {/* Row 2 */}
        {/* Completion Rate */}
        <div className={`rounded-xl border p-5 ${variantStyles['default']}`}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Completion Rate</p>
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
              <Icon name="CheckCircleIcon" size={18} className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">73.2%</p>
          <p className="text-xs text-muted-foreground mb-1">Of purchased accesses</p>
          <p className="text-xs text-red-500 font-500 flex items-center gap-1">
            <Icon name="ArrowTrendingDownIcon" size={12} />
            -2.1% vs last week
          </p>
        </div>

        {/* Verified Producers */}
        <div className={`rounded-xl border p-5 ${variantStyles['default']}`}>
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Verified Producers</p>
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <Icon name="VideoCameraIcon" size={18} className="text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">38</p>
          <p className="text-xs text-muted-foreground mb-1">Active on platform</p>
          <p className="text-xs text-green-600 font-500 flex items-center gap-1">
            <Icon name="ArrowTrendingUpIcon" size={12} />
            +2 this week
          </p>
        </div>

        {/* Published Movies — col-span-2 to fill row */}
        <div className={`rounded-xl border p-5 ${variantStyles['default']} col-span-1 sm:col-span-2 lg:col-span-2`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Published Movies</p>
              <p className="text-xs text-muted-foreground mt-0.5">Live and purchasable by viewers</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Icon name="FilmIcon" size={18} className="text-indigo-600" />
            </div>
          </div>
          <div className="flex items-end gap-6">
            <div>
              <p className="text-4xl font-700 text-foreground tabular-nums leading-none">214</p>
              <p className="text-xs text-muted-foreground mt-1">Total live movies</p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3">
              {[
                { key: 'stat-drama', label: 'Drama', count: 78 },
                { key: 'stat-doc', label: 'Documentary', count: 54 },
                { key: 'stat-thriller', label: 'Thriller', count: 82 },
              ].map((stat) => (
                <div key={stat.key} className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-lg font-700 tabular-nums text-foreground">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-green-600 font-500 flex items-center gap-1 mt-3">
            <Icon name="ArrowTrendingUpIcon" size={12} />
            +11 published this month
          </p>
        </div>
      </div>
    </div>
  );
}