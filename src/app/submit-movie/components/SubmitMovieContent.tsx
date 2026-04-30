'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SubmitMovieForm {
  title: string;
  genre: string;
  price: string;
  description: string;
  videoFile: File | null;
}

interface FormErrors {
  title?: string;
  genre?: string;
  price?: string;
  videoFile?: string;
}

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Thriller',
  'Sci-Fi',
  'Romance',
  'Documentary',
  'Animation',
  'Fantasy',
  'Mystery',
  'Biography',
];

type SubmitState = 'idle' | 'submitting' | 'success';

export default function SubmitMovieContent() {
  const [form, setForm] = useState<SubmitMovieForm>({
    title: '',
    genre: '',
    price: '',
    description: '',
    videoFile: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Movie title is required.';
    if (!form.genre) newErrors.genre = 'Please select a genre.';
    if (!form.price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = 'Enter a valid price (e.g. 4.99).';
    }
    if (!form.videoFile) newErrors.videoFile = 'Please upload a video file.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof SubmitMovieForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mkv'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|avi|webm|mkv)$/i)) {
      setErrors((prev) => ({ ...prev, videoFile: 'Only video files are accepted (MP4, MOV, AVI, WebM, MKV).' }));
      return;
    }
    setForm((prev) => ({ ...prev, videoFile: file }));
    setErrors((prev) => ({ ...prev, videoFile: undefined }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitState('submitting');
    // Simulated async submission — replace with actual API call
    await new Promise((res) => setTimeout(res, 1800));
    setSubmitState('success');
  };

  const handleReset = () => {
    setForm({ title: '', genre: '', price: '', description: '', videoFile: null });
    setErrors({});
    setSubmitState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (submitState === 'success') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Page header */}
        <div className="px-6 lg:px-8 xl:px-10 pt-6 pb-4 border-b border-border bg-white">
          <div className="max-w-screen-2xl mx-auto">
            <h1 className="text-2xl font-700 text-foreground">Submit Movie</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Submit your film for admin review and approval
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="card-elevated-md p-10 max-w-md w-full text-center fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <Icon name="CheckCircleIcon" size={36} className="text-green-600" />
            </div>
            <h2 className="text-xl font-700 text-foreground mb-2">Submission Received</h2>
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-600 text-foreground">&ldquo;{form.title}&rdquo;</span> has been submitted for admin review.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You&apos;ll be notified once the admin approves or rejects your submission.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleReset} className="btn-primary w-full">
                Submit Another Movie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page header */}
      <div className="px-6 lg:px-8 xl:px-10 pt-6 pb-4 border-b border-border bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-700 text-foreground">Submit Movie</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Submit your film for admin review and approval
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-500 text-amber-700">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 lg:px-8 xl:px-10 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-8">
            <Icon name="InformationCircleIcon" size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              All submissions are reviewed by the CineGate admin team before going live. Ensure your video file is high quality and your pricing is competitive.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="card-elevated-md p-6 lg:p-8 space-y-6">

              {/* Movie Title */}
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Movie Title <span className="text-cinegate-red">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. The Last Horizon"
                  className={`input-field ${errors.title ? 'error' : ''}`}
                  disabled={submitState === 'submitting'}
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <Icon name="ExclamationCircleIcon" size={13} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Genre + Price row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Genre */}
                <div>
                  <label className="block text-sm font-600 text-foreground mb-1.5">
                    Genre <span className="text-cinegate-red">*</span>
                  </label>
                  <select
                    value={form.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className={`input-field appearance-none bg-white ${errors.genre ? 'error' : ''}`}
                    disabled={submitState === 'submitting'}
                  >
                    <option value="">Select genre…</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.genre && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <Icon name="ExclamationCircleIcon" size={13} />
                      {errors.genre}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-600 text-foreground mb-1.5">
                    Price (USD) <span className="text-cinegate-red">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="4.99"
                      className={`input-field pl-7 ${errors.price ? 'error' : ''}`}
                      disabled={submitState === 'submitting'}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <Icon name="ExclamationCircleIcon" size={13} />
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Description <span className="text-xs font-400 text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief synopsis of your film…"
                  rows={3}
                  className="input-field resize-none"
                  disabled={submitState === 'submitting'}
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-600 text-foreground mb-1.5">
                  Video File <span className="text-cinegate-red">*</span>
                </label>

                {form.videoFile ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon name="FilmIcon" size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-foreground truncate">{form.videoFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(form.videoFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, videoFile: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-muted-foreground hover:text-destructive transition-colors"
                      disabled={submitState === 'submitting'}
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 ${
                      dragOver
                        ? 'border-cinegate-red bg-red-50/60 scale-[1.01]'
                        : errors.videoFile
                        ? 'border-destructive bg-red-50/30' :'border-border bg-muted/30 hover:border-cinegate-red/50 hover:bg-red-50/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Icon name="ArrowUpTrayIcon" size={24} className="text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-600 text-foreground">
                        {dragOver ? 'Drop to upload' : 'Drag & drop your video here'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        or <span className="text-cinegate-red font-600">browse files</span> — MP4, MOV, AVI, WebM, MKV
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,.mkv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      disabled={submitState === 'submitting'}
                    />
                  </div>
                )}

                {errors.videoFile && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <Icon name="ExclamationCircleIcon" size={13} />
                    {errors.videoFile}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitState === 'submitting'}
                  className="btn-primary flex-1 sm:flex-none sm:min-w-[180px]"
                >
                  {submitState === 'submitting' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Icon name="PaperAirplaneIcon" size={16} />
                      Submit for Review
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitState === 'submitting'}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
