"use client";

import React, { useState } from "react";sssimport React, { useState } from 'react';

const screens = [
  { id: 'login', label: 'Login' },
  { id: 'admin', label: 'Admin Dashboard' },
  { id: 'producer', label: 'Producer Dashboard' },
  { id: 'submit', label: 'Submit Movie' },
  { id: 'player', label: 'Movie Player' },
];

const movies = [
  { title: 'The Last Horizon', status: 'Approved', price: '$7.99', views: 312 },
  { title: 'Neon Requiem', status: 'Pending', price: '$5.99', views: 0 },
  { title: 'Dust & Silence', status: 'Approved', price: '$4.99', views: 198 },
];

function Badge({ children, tone = 'green' }) {
  const styles = {
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${styles[tone]}`}>{children}</span>;
}

function Card({ title, value, note }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

function Login({ setPage }) {
  return (
    <div className="grid min-h-[640px] grid-cols-1 bg-white lg:grid-cols-2">
      <div className="flex flex-col justify-between bg-gradient-to-br from-slate-950 to-red-950 p-10 text-white">
        <div>
          <div className="mb-10 inline-flex rounded-2xl bg-red-600 px-4 py-3 text-xl font-black">CineGate</div>
          <h1 className="max-w-xl text-4xl font-black leading-tight">Upload movies, sell access, and block repeat viewing after one watch.</h1>
          <p className="mt-5 max-w-lg text-lg text-slate-300">A simple movie monetization platform for producers, admins, and viewers.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-2xl bg-white/10 p-4">Secure Access</div>
          <div className="rounded-2xl bg-white/10 p-4">Payment Link</div>
          <div className="rounded-2xl bg-white/10 p-4">One Viewing</div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-black">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Demo preview screen</p>
          <input className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email address" />
          <input className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" />
          <button onClick={() => setPage('admin')} className="mt-5 w-full rounded-2xl bg-red-600 px-4 py-3 font-bold text-white">Sign in as Admin</button>
          <button onClick={() => setPage('producer')} className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold">Continue as Producer</button>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-3xl font-black">Admin Dashboard</h2>
      <p className="mt-1 text-slate-500">Approvals, access control, revenue, and platform monitoring.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Active Producers" value="128" note="Registered movie producers" />
        <Card title="Movies Uploaded" value="342" note="7 awaiting approval" />
        <Card title="Total Views" value="24.8k" note="Completed paid views" />
        <Card title="Revenue" value="$18.4k" note="Across all movies" />
      </div>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black">Pending Movie Reviews</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          {['Crimson Tide Rising', 'Neon Requiem', 'Golden Sands'].map((movie, index) => (
            <div key={movie} className="grid grid-cols-3 gap-3 border-b border-slate-100 p-4 text-sm last:border-b-0">
              <strong>{movie}</strong>
              <span className="text-slate-500">Producer #{index + 1}</span>
              <Badge tone="yellow">Pending</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Producer({ setPage }) {
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black">Producer Dashboard</h2>
          <p className="mt-1 text-slate-500">Track submissions, approvals, views, and earnings.</p>
        </div>
        <button onClick={() => setPage('submit')} className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white">Submit New Movie</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="Total Earnings" value="$5,793" note="Lifetime producer earnings" />
