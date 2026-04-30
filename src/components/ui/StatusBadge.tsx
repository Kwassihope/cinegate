import React from 'react';

type StatusVariant =
  | 'approved' |'pending' |'rejected' |'suspended' |'published' |'draft' |'active' |'completed' |'expired' |'paid' |'blocked';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusVariant, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  approved: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', defaultLabel: 'Approved' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', defaultLabel: 'Pending Review' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', defaultLabel: 'Rejected' },
  suspended: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', defaultLabel: 'Suspended' },
  published: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', defaultLabel: 'Published' },
  draft: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', defaultLabel: 'Draft' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', defaultLabel: 'Active' },
  completed: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', defaultLabel: 'Completed' },
  expired: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400', defaultLabel: 'Expired' },
  paid: { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500', defaultLabel: 'Paid' },
  blocked: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-600', defaultLabel: 'Blocked' },
};

export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-500 ${config.bg} ${config.text} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {displayLabel}
    </span>
  );
}