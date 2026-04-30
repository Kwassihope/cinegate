'use client';

import React, { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-card-lg border border-border w-full max-w-md scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                confirmVariant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
              }`}
            >
              <Icon
                name={confirmVariant === 'danger' ? 'ExclamationTriangleIcon' : 'InformationCircleIcon'}
                size={20}
                className={confirmVariant === 'danger' ? 'text-red-600' : 'text-blue-600'}
              />
            </div>
            <div className="flex-1">
              <h3 id="confirm-modal-title" className="text-base font-600 text-foreground mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-xl">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-600 text-white transition-all duration-150 active:scale-95 ${
              confirmVariant === 'danger' ?'bg-red-600 hover:bg-red-700' :'btn-primary'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isLoading && (
              <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}