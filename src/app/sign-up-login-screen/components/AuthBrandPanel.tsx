import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

const features = [
  {
    key: 'feat-upload',
    icon: '🎬',
    title: 'Upload & Monetize',
    desc: 'Producers upload films and set pay-per-view pricing instantly.',
  },
  {
    key: 'feat-approve',
    icon: '✅',
    title: 'Admin-Controlled Quality',
    desc: 'Every movie and producer is reviewed before going live.',
  },
  {
    key: 'feat-access',
    icon: '🔐',
    title: 'One-Time Access Enforcement',
    desc: 'Viewers pay once, watch once — access blocked after completion.',
  },
  {
    key: 'feat-payment',
    icon: '💳',
    title: 'Secure Payment Links',
    desc: 'Generate unique payment links per movie, per viewer.',
  },
];

export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between cinegate-gradient p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/3 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-cinegate-red/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-cinegate-deep/40 blur-2xl" />
      </div>
      {/* Film strip decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col opacity-10">
        {Array.from({ length: 30 })?.map((_, i) => (
          <div
            key={`strip-${i}`}
            className="w-8 h-6 border-2 border-white mx-auto mb-1 rounded-sm flex-shrink-0"
          />
        ))}
      </div>
      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <AppLogo size={40} />
          <span className="text-white text-2xl font-700 tracking-tight">CineGate</span>
        </div>

        <h1 className="text-4xl xl:text-5xl font-700 text-white leading-tight mb-4">
          Independent Cinema,<br />
          <span className="text-cinegate-red">Gated for Value.</span>
        </h1>
        <p className="text-white/70 text-lg leading-relaxed max-w-md">
          The pay-per-view platform built for independent filmmakers.
          Upload, get approved, and let your audience pay to watch — once.
        </p>
      </div>
      {/* Features */}
      <div className="relative z-10 grid grid-cols-1 gap-4">
        {features?.map((feature) => (
          <div
            key={feature?.key}
            className="flex items-start gap-4 bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <span className="text-2xl flex-shrink-0">{feature?.icon}</span>
            <div>
              <p className="text-white font-600 text-sm mb-0.5">{feature?.title}</p>
              <p className="text-white/60 text-sm leading-relaxed">{feature?.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Footer note */}
      <div className="relative z-10 mt-8">
        <p className="text-white/40 text-xs">
          © 2026 CineGate, Inc. — Empowering independent cinema worldwide.
        </p>
      </div>
    </div>
  );
}