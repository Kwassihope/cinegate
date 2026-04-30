'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthBrandPanel from './AuthBrandPanel';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export type AuthTab = 'signin' | 'signup';

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const router = useRouter();

  const handleAuthSuccess = (role: 'admin' | 'producer' | 'viewer') => {
    // Backend integration point: replace with actual session/token handling
    if (role === 'admin') {
      router.push('/admin-dashboard');
    } else if (role === 'producer') {
      router.push('/admin-dashboard');
    } else {
      router.push('/movie-player-screen');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand Panel */}
      <AuthBrandPanel />

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="w-full max-w-md fade-in">
          {/* Tab switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-600 transition-all duration-200 ${
                activeTab === 'signin' ?'bg-white text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-600 transition-all duration-200 ${
                activeTab === 'signup' ?'bg-white text-foreground shadow-card' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {activeTab === 'signin' ? (
            <LoginForm onSuccess={handleAuthSuccess} onSwitchTab={() => setActiveTab('signup')} />
          ) : (
            <SignUpForm onSuccess={handleAuthSuccess} onSwitchTab={() => setActiveTab('signin')} />
          )}
        </div>
      </div>
    </div>
  );
}