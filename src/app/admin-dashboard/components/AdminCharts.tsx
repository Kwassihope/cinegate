'use client';

import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const dailyAccessData = [
  { day: 'Apr 18', purchases: 34, completions: 22 },
  { day: 'Apr 19', purchases: 41, completions: 29 },
  { day: 'Apr 20', purchases: 28, completions: 19 },
  { day: 'Apr 21', purchases: 55, completions: 38 },
  { day: 'Apr 22', purchases: 62, completions: 47 },
  { day: 'Apr 23', purchases: 48, completions: 31 },
  { day: 'Apr 24', purchases: 71, completions: 53 },
  { day: 'Apr 25', purchases: 83, completions: 64 },
  { day: 'Apr 26', purchases: 67, completions: 49 },
  { day: 'Apr 27', purchases: 91, completions: 58 },
];

const genreData = [
  { genre: 'Drama', movies: 78, revenue: 8420 },
  { genre: 'Thriller', movies: 82, revenue: 11230 },
  { genre: 'Sci-Fi', movies: 31, revenue: 5870 },
  { genre: 'Documentary', movies: 54, revenue: 3190 },
  { genre: 'Action', movies: 29, revenue: 6740 },
  { genre: 'Comedy', movies: 18, revenue: 2890 },
  { genre: 'Horror', movies: 22, revenue: 4310 },
];

const CustomAreaTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-card-lg p-3 min-w-[160px]">
      <p className="text-xs font-600 text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={`tooltip-entry-${i}`} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="text-xs font-600 text-foreground tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-card-lg p-3 min-w-[160px]">
      <p className="text-xs font-600 text-foreground mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={`bar-tooltip-${i}`} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="text-xs font-600 text-foreground tabular-nums">
            {entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

interface AdminChartsProps {
  fullView?: boolean;
}

export default function AdminCharts({ fullView = false }: AdminChartsProps) {
  const [barMetric, setBarMetric] = useState<'movies' | 'revenue'>('movies');

  return (
    <div className={`space-y-6 ${fullView ? '' : ''}`}>
      {/* Daily Access Purchases — Area Chart */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-600 text-foreground">Daily Access Purchases</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Paid accesses vs completed viewings — last 10 days</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-cinegate-red opacity-80" />
              <span className="text-xs text-muted-foreground">Purchases</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-cinegate-navy opacity-80" />
              <span className="text-xs text-muted-foreground">Completions</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyAccessData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e94560" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="completionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a1a2e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomAreaTooltip />} />
            <Area
              type="monotone"
              dataKey="purchases"
              stroke="#e94560"
              strokeWidth={2}
              fill="url(#purchasesGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#e94560', stroke: 'white', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="completions"
              stroke="#1a1a2e"
              strokeWidth={2}
              fill="url(#completionsGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#1a1a2e', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Genre Distribution — Bar Chart */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-600 text-foreground">Genre Breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {barMetric === 'movies' ? 'Published movies by genre' : 'Revenue by genre (USD)'}
            </p>
          </div>
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setBarMetric('movies')}
              className={`px-3 py-1.5 text-xs font-500 rounded-md transition-all duration-150 ${
                barMetric === 'movies' ?'bg-white text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setBarMetric('revenue')}
              className={`px-3 py-1.5 text-xs font-500 rounded-md transition-all duration-150 ${
                barMetric === 'revenue' ?'bg-white text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Revenue
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={genreData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
            <XAxis
              dataKey="genre"
              tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={barMetric === 'revenue' ? (v) => `$${(v / 1000).toFixed(0)}k` : undefined}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar
              dataKey={barMetric}
              fill="#e94560"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}