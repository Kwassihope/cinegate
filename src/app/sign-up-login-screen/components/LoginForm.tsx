'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import DemoCredentialsBox from './DemoCredentialsBox';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const MOCK_CREDENTIALS: Record<string, { password: string; role: 'admin' | 'producer' | 'viewer' }> = {
  'admin@cinegate.io': { password: 'CineAdmin#2026', role: 'admin' },
  'maya.rivera@studioindigo.com': { password: 'Producer@Gate26', role: 'producer' },
  'theo.nakamura@gmail.com': { password: 'Viewer$Watch1', role: 'viewer' },
};

interface LoginFormProps {
  onSuccess: (role: 'admin' | 'producer' | 'viewer') => void;
  onSwitchTab: () => void;
}

export default function LoginForm({ onSuccess, onSwitchTab }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleAutofill = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Backend integration point: replace with Supabase auth.signInWithPassword()
    await new Promise((r) => setTimeout(r, 1200));

    const match = MOCK_CREDENTIALS[data.email.toLowerCase().trim()];
    if (!match || match.password !== data.password) {
      setError('email', {
        message: 'Invalid credentials — use the demo accounts below to sign in',
      });
      setIsLoading(false);
      return;
    }

    toast.success(`Welcome back! Signed in as ${match.role}.`);
    setIsLoading(false);
    onSuccess(match.role);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    // Backend integration point: replace with Supabase auth.signInWithOAuth({ provider: 'google' })
    await new Promise((r) => setTimeout(r, 1500));
    toast.info('Google sign-in would redirect to OAuth flow.');
    setIsGoogleLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-700 text-foreground mb-1.5">Welcome back</h2>
        <p className="text-muted-foreground text-sm">
          Sign in to your CineGate account to continue.
        </p>
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="btn-secondary w-full mb-4 py-3 text-sm font-500"
      >
        {isGoogleLoading ? (
          <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or sign in with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="login-email" className="block text-sm font-500 text-foreground mb-1.5">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={`input-field ${errors.email ? 'error' : ''}`}
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="text-sm font-500 text-foreground">
              Password
            </label>
            <button type="button" className="text-xs text-cinegate-red hover:text-cinegate-red-dark font-500 transition-colors">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`input-field pr-10 ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2 mb-6">
          <input
            id="login-remember"
            type="checkbox"
            className="w-4 h-4 rounded border-border accent-cinegate-red cursor-pointer"
            {...register('rememberMe')}
          />
          <label htmlFor="login-remember" className="text-sm text-muted-foreground cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-sm"
          style={{ minWidth: '100%' }}
        >
          {isLoading ? (
            <>
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Icon name="ArrowRightCircleIcon" size={16} />
              Sign In to CineGate
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{' '}
        <button
          onClick={onSwitchTab}
          className="text-cinegate-red font-600 hover:text-cinegate-red-dark transition-colors"
        >
          Create one for free
        </button>
      </p>

      <DemoCredentialsBox onAutofill={handleAutofill} />
    </div>
  );
}