'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

type UserRole = 'viewer' | 'producer';

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  companyName?: string;
  agreeTerms: boolean;
}

interface SignUpFormProps {
  onSuccess: (role: 'admin' | 'producer' | 'viewer') => void;
  onSwitchTab: () => void;
}

export default function SignUpForm({ onSuccess, onSwitchTab }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: { role: 'viewer', agreeTerms: false },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    // Backend integration point: replace with Supabase auth.signUp() + insert into profiles table
    await new Promise((r) => setTimeout(r, 1400));
    toast.success(
      data.role === 'producer' ?'Account created! Your producer profile is pending admin verification.' :'Account created! Welcome to CineGate.'
    );
    setIsLoading(false);
    onSuccess(data.role);
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    // Backend integration point: replace with Supabase auth.signInWithOAuth({ provider: 'google' })
    await new Promise((r) => setTimeout(r, 1500));
    toast.info('Google sign-up would redirect to OAuth flow.');
    setIsGoogleLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-700 text-foreground mb-1.5">Create your account</h2>
        <p className="text-muted-foreground text-sm">
          Join CineGate as a viewer or an independent producer.
        </p>
      </div>

      {/* Role selector */}
      <div className="mb-6">
        <p className="text-sm font-500 text-foreground mb-2">I am joining as a…</p>
        <div className="grid grid-cols-2 gap-3">
          {(['viewer', 'producer'] as const).map((role) => (
            <button
              key={`role-${role}`}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 ${
                selectedRole === role
                  ? 'border-cinegate-red bg-red-50 text-cinegate-red' :'border-border bg-white text-muted-foreground hover:border-cinegate-red/40'
              }`}
            >
              <Icon
                name={role === 'viewer' ? 'PlayCircleIcon' : 'VideoCameraIcon'}
                size={22}
              />
              <div className="text-center">
                <p className="text-sm font-600 capitalize">{role}</p>
                <p className="text-xs opacity-70 mt-0.5">
                  {role === 'viewer' ? 'Watch movies' : 'Upload & sell films'}
                </p>
              </div>
            </button>
          ))}
        </div>
        {selectedRole === 'producer' && (
          <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
            <Icon name="InformationCircleIcon" size={13} />
            Producer accounts require admin verification before publishing movies.
          </p>
        )}
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogleSignUp}
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
        <span className="text-xs text-muted-foreground">or register with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Full name */}
        <div>
          <label htmlFor="signup-name" className="block text-sm font-500 text-foreground mb-1.5">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            className={`input-field ${errors.fullName ? 'error' : ''}`}
            placeholder="Your full name"
            {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-500 text-foreground mb-1.5">
            Email address
          </label>
          <input
            id="signup-email"
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

        {/* Company name (producer only) */}
        {selectedRole === 'producer' && (
          <div>
            <label htmlFor="signup-company" className="block text-sm font-500 text-foreground mb-1.5">
              Studio / Company name
              <span className="text-muted-foreground font-400 ml-1">(optional)</span>
            </label>
            <input
              id="signup-company"
              type="text"
              className="input-field"
              placeholder="e.g. Indigo Films Studio"
              {...register('companyName')}
            />
          </div>
        )}

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-500 text-foreground mb-1.5">
            Password
          </label>
          <p className="text-xs text-muted-foreground mb-1.5">Minimum 8 characters with a number and symbol.</p>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`input-field pr-10 ${errors.password ? 'error' : ''}`}
              placeholder="Create a strong password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                  message: 'Password must include a number and a special character',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

        {/* Confirm password */}
        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-500 text-foreground mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`input-field pr-10 ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Repeat your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordValue || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-start gap-2">
            <input
              id="signup-terms"
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded border-border accent-cinegate-red cursor-pointer flex-shrink-0"
              {...register('agreeTerms', { required: 'You must agree to the terms to continue' })}
            />
            <label htmlFor="signup-terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
              I agree to CineGate&apos;s{' '}
              <span className="text-cinegate-red font-500 hover:text-cinegate-red-dark cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-cinegate-red font-500 hover:text-cinegate-red-dark cursor-pointer">Privacy Policy</span>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={12} />
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-sm"
        >
          {isLoading ? (
            <>
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <Icon name="UserPlusIcon" size={16} />
              Create {selectedRole === 'producer' ? 'Producer' : 'Viewer'} Account
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <button
          onClick={onSwitchTab}
          className="text-cinegate-red font-600 hover:text-cinegate-red-dark transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}