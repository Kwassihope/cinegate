'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import PaymentGatewaySettings from './PaymentGatewaySettings';

interface Movie {
  id: string;
  title: string;
  genre: string;
  price: number;
  submittedAt: string;
  status: 'approved' | 'pending' | 'rejected';
  views: number;
  revenue: number;
  thumbnail: string;
  thumbnailAlt: string;
  rejectionReason?: string;
}

interface AccountDetails {
  name: string;
  email: string;
  studio: string;
  joinedAt: string;
  accountStatus: 'active' | 'pending' | 'suspended';
  totalMovies: number;
  approvedMovies: number;
  payoutMethod: string;
  payoutEmail: string;
}

const mockMovies: Movie[] = [
{
  id: 'mv-001',
  title: 'The Last Horizon',
  genre: 'Sci-Fi',
  price: 7.99,
  submittedAt: 'Apr 18, 2026',
  status: 'approved',
  views: 312,
  revenue: 2492.88,
  thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_166b322c4-1772728889934.png",
  thumbnailAlt: 'Vast cosmic horizon with stars and nebula in deep space'
},
{
  id: 'mv-002',
  title: 'Neon Requiem',
  genre: 'Thriller',
  price: 5.99,
  submittedAt: 'Apr 22, 2026',
  status: 'pending',
  views: 0,
  revenue: 0,
  thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_182c02c0a-1767582304230.png",
  thumbnailAlt: 'Dark neon-lit city street at night with rain reflections'
},
{
  id: 'mv-003',
  title: 'Dust & Silence',
  genre: 'Drama',
  price: 4.99,
  submittedAt: 'Apr 10, 2026',
  status: 'approved',
  views: 198,
  revenue: 988.02,
  thumbnail: "https://images.unsplash.com/photo-1673581209465-27acdf45a017",
  thumbnailAlt: 'Lone figure walking through a dusty desert landscape at sunset'
},
{
  id: 'mv-004',
  title: 'Fractured Light',
  genre: 'Documentary',
  price: 3.99,
  submittedAt: 'Mar 30, 2026',
  status: 'rejected',
  views: 0,
  revenue: 0,
  thumbnail: "https://images.unsplash.com/photo-1689030534237-3e4719b2e6c0",
  thumbnailAlt: 'Prism splitting white light into colorful spectrum on dark background',
  rejectionReason: 'Video quality does not meet minimum 1080p requirement.'
},
{
  id: 'mv-005',
  title: 'Crimson Tide Rising',
  genre: 'Action',
  price: 6.99,
  submittedAt: 'Apr 25, 2026',
  status: 'pending',
  views: 0,
  revenue: 0,
  thumbnail: "https://images.unsplash.com/photo-1712744170848-64725212f044",
  thumbnailAlt: 'Dramatic ocean waves crashing against rocky cliffs at dusk'
},
{
  id: 'mv-006',
  title: 'Hollow Ground',
  genre: 'Horror',
  price: 5.49,
  submittedAt: 'Apr 5, 2026',
  status: 'approved',
  views: 421,
  revenue: 2312.29,
  thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_117958c6d-1772542549160.png",
  thumbnailAlt: 'Eerie abandoned house surrounded by dead trees in foggy night'
}];


const mockAccount: AccountDetails = {
  name: 'Maya Rivera',
  email: 'maya.rivera@studioindigo.com',
  studio: 'Studio Indigo',
  joinedAt: 'January 14, 2025',
  accountStatus: 'active',
  totalMovies: 6,
  approvedMovies: 3,
  payoutMethod: 'Bank Transfer',
  payoutEmail: 'payouts@studioindigo.com'
};

type FilterTab = 'all' | 'approved' | 'pending' | 'rejected';

export default function ProducerDashboardContent() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const totalRevenue = mockMovies.reduce((sum, m) => sum + m.revenue, 0);
  const totalViews = mockMovies.reduce((sum, m) => sum + m.views, 0);
  const approvedCount = mockMovies.filter((m) => m.status === 'approved').length;
  const pendingCount = mockMovies.filter((m) => m.status === 'pending').length;

  const filteredMovies =
  activeFilter === 'all' ? mockMovies : mockMovies.filter((m) => m.status === activeFilter);

  const filterTabs: {key: FilterTab;label: string;count: number;}[] = [
  { key: 'all', label: 'All Movies', count: mockMovies.length },
  { key: 'approved', label: 'Approved', count: approvedCount },
  { key: 'pending', label: 'Pending', count: pendingCount },
  { key: 'rejected', label: 'Rejected', count: mockMovies.filter((m) => m.status === 'rejected').length }];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="px-6 lg:px-8 xl:px-10 pt-6 pb-4 border-b border-border bg-white">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Producer Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track your submissions, approval status, and earnings
            </p>
          </div>
          <a
            href="/submit-movie"
            className="btn-primary flex items-center gap-2 text-sm">

            <Icon name="PlusIcon" size={16} />
            Submit New Movie
          </a>
        </div>
      </div>

      <div className="flex-1 px-6 lg:px-8 xl:px-10 py-8">
        <div className="max-w-screen-2xl mx-auto space-y-8">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue — hero */}
            <div className="col-span-2 rounded-xl border border-green-200 bg-green-50/50 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Total Revenue Earned</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Across all approved movies</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Icon name="BanknotesIcon" size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end gap-6">
                <div>
                  <p className="text-4xl font-700 text-foreground tabular-nums leading-none">
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/70 border border-green-100 px-3 py-2">
                    <p className="text-xs text-muted-foreground">This Month</p>
                    <p className="text-lg font-700 text-foreground tabular-nums">$1,840</p>
                  </div>
                  <div className="rounded-lg bg-white/70 border border-green-100 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Pending Payout</p>
                    <p className="text-lg font-700 text-foreground tabular-nums">$620</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Views */}
            <div className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Total Views</p>
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Icon name="EyeIcon" size={18} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">
                {totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Completed viewings</p>
              <p className="text-xs text-blue-600 font-500 flex items-center gap-1 mt-1">
                <Icon name="ArrowTrendingUpIcon" size={12} />
                +47 this week
              </p>
            </div>

            {/* Approved Movies */}
            <div className="rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider">Approved Movies</p>
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Icon name="FilmIcon" size={18} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-700 text-foreground tabular-nums leading-none mb-1">
                {approvedCount}
                <span className="text-base font-500 text-muted-foreground"> / {mockMovies.length}</span>
              </p>
              <p className="text-xs text-muted-foreground">Live on platform</p>
              <p className="text-xs text-amber-600 font-500 flex items-center gap-1 mt-1">
                <Icon name="ClockIcon" size={12} />
                {pendingCount} awaiting review
              </p>
            </div>
          </div>

          {/* Submitted Movies Table */}
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-600 text-foreground">Submitted Movies</h2>
              {/* Filter tabs */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {filterTabs.map((tab) =>
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-500 transition-all ${
                  activeFilter === tab.key ?
                  'bg-white text-foreground shadow-sm' :
                  'text-muted-foreground hover:text-foreground'}`
                  }>

                    {tab.label}
                    <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs tabular-nums ${
                    activeFilter === tab.key ? 'bg-muted text-foreground' : 'bg-background text-muted-foreground'}`
                    }>

                      {tab.count}
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Movie
                    </th>
                    <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Genre
                    </th>
                    <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Price
                    </th>
                    <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-600 text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Views
                    </th>
                    <th className="text-right text-xs font-600 text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Revenue
                    </th>
                    <th className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMovies.map((movie) =>
                  <tr key={movie.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                          src={movie.thumbnail}
                          alt={movie.thumbnailAlt}
                          className="w-14 h-9 rounded-md object-cover flex-shrink-0 bg-muted" />

                          <span className="text-sm font-500 text-foreground">{movie.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{movie.genre}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-500 text-foreground">${movie.price.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <StatusBadge status={movie.status} />
                          {movie.status === 'rejected' && movie.rejectionReason &&
                        <p className="text-xs text-red-500 mt-1 max-w-[180px] leading-tight">
                              {movie.rejectionReason}
                            </p>
                        }
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm tabular-nums text-foreground">
                          {movie.views > 0 ? movie.views.toLocaleString() : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                        className={`text-sm tabular-nums font-500 ${
                        movie.revenue > 0 ? 'text-green-600' : 'text-muted-foreground'}`
                        }>

                          {movie.revenue > 0 ?
                        `$${movie.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                        '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{movie.submittedAt}</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {filteredMovies.length === 0 &&
              <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Icon name="FilmIcon" size={22} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-500 text-foreground">No movies found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No {activeFilter !== 'all' ? activeFilter : ''} submissions yet.
                  </p>
                </div>
              }
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-base font-600 text-foreground mb-5">Account Details</h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-cinegate-red flex items-center justify-center text-white text-xl font-700 flex-shrink-0">
                  {mockAccount.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-600 text-foreground">{mockAccount.name}</p>
                  <p className="text-sm text-muted-foreground">{mockAccount.studio}</p>
                  <div className="mt-1">
                    <StatusBadge status={mockAccount.accountStatus} size="sm" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="EnvelopeIcon" size={15} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{mockAccount.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="CalendarDaysIcon" size={15} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">Joined {mockAccount.joinedAt}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="FilmIcon" size={15} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    {mockAccount.approvedMovies} of {mockAccount.totalMovies} movies approved
                  </span>
                </div>
              </div>
            </div>

            {/* Payout details */}
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-base font-600 text-foreground mb-5">Payout Settings</h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider mb-1">Method</p>
                  <div className="flex items-center gap-2">
                    <Icon name="CreditCardIcon" size={16} className="text-foreground" />
                    <span className="text-sm font-500 text-foreground">{mockAccount.payoutMethod}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider mb-1">Payout Email</p>
                  <div className="flex items-center gap-2">
                    <Icon name="EnvelopeIcon" size={16} className="text-foreground" />
                    <span className="text-sm font-500 text-foreground truncate">{mockAccount.payoutEmail}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
                  <div className="flex items-start gap-2">
                    <Icon name="InformationCircleIcon" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Payouts are processed on the 1st of each month for the previous month&apos;s earnings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue breakdown */}
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-base font-600 text-foreground mb-5">Revenue Breakdown</h2>
              <div className="space-y-3">
                {mockMovies.
                filter((m) => m.revenue > 0).
                sort((a, b) => b.revenue - a.revenue).
                map((movie) => {
                  const pct = Math.round(movie.revenue / totalRevenue * 100);
                  return (
                    <div key={movie.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-500 text-foreground truncate max-w-[140px]">
                            {movie.title}
                          </span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            ${movie.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                          className="h-full rounded-full bg-cinegate-red"
                          style={{ width: `${pct}%` }} />

                        </div>
                      </div>);

                })}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-600 text-foreground">Total</span>
                  <span className="text-sm font-700 text-green-600 tabular-nums">
                    ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway Settings */}
          <PaymentGatewaySettings />

        </div>
      </div>
    </div>);

}