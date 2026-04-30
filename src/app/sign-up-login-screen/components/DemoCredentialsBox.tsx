'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Credential {
  role: 'admin' | 'producer' | 'viewer';
  label: string;
  email: string;
  password: string;
  color: string;
  bgColor: string;
}

const credentials: Credential[] = [
  {
    role: 'admin',
    label: 'Admin',
    email: 'admin@cinegate.io',
    password: 'CineAdmin#2026',
    color: 'text-cinegate-red',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    role: 'producer',
    label: 'Producer',
    email: 'maya.rivera@studioindigo.com',
    password: 'Producer@Gate26',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    role: 'viewer',
    label: 'Viewer',
    email: 'theo.nakamura@gmail.com',
    password: 'Viewer$Watch1',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
  },
];

interface DemoCredentialsBoxProps {
  onAutofill: (email: string, password: string) => void;
}

export default function DemoCredentialsBox({ onAutofill }: DemoCredentialsBoxProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="BeakerIcon" size={14} className="text-amber-600" />
        <p className="text-xs font-600 text-amber-700 uppercase tracking-wider">Demo Accounts</p>
      </div>
      <div className="space-y-2">
        {credentials.map((cred) => (
          <div key={`cred-${cred.role}`} className={`rounded-lg border p-3 ${cred.bgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-700 uppercase tracking-wider ${cred.color}`}>
                {cred.label}
              </span>
              <button
                onClick={() => onAutofill(cred.email, cred.password)}
                className="text-xs font-600 text-cinegate-red hover:text-cinegate-red-dark flex items-center gap-1 transition-colors"
              >
                <Icon name="ArrowRightCircleIcon" size={12} />
                Use
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-gray-600 truncate">{cred.email}</span>
                <button
                  onClick={() => handleCopy(cred.email, `${cred.role}-email`)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Copy email"
                >
                  <Icon
                    name={copiedKey === `${cred.role}-email` ? 'CheckIcon' : 'ClipboardIcon'}
                    size={12}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-gray-600">{'•'.repeat(cred.password.length)}</span>
                <button
                  onClick={() => handleCopy(cred.password, `${cred.role}-pass`)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Copy password"
                >
                  <Icon
                    name={copiedKey === `${cred.role}-pass` ? 'CheckIcon' : 'ClipboardIcon'}
                    size={12}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}