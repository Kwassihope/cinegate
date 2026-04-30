'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

import ConfirmModal from '@/components/ui/ConfirmModal';

interface PendingProducer {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  genre: string;
  moviesUploaded: number;
  submittedAt: string;
  portfolioUrl: string;
  bio: string;
  idVerified: boolean;
}

const initialProducers: PendingProducer[] = [
  {
    id: 'producer-001',
    name: 'Arjun Mehta',
    email: 'arjun@mehtafilms.in',
    company: 'Mehta Films',
    country: 'India',
    genre: 'Action / Thriller',
    moviesUploaded: 1,
    submittedAt: 'Apr 27, 2026',
    portfolioUrl: 'mehtafilms.in',
    bio: 'Mumbai-based filmmaker with 12 years in Bollywood production. Transitioning to independent releases.',
    idVerified: true,
  },
  {
    id: 'producer-002',
    name: 'Camille Dubois',
    email: 'camille@duboiscinema.fr',
    company: 'Dubois Cinéma',
    country: 'France',
    genre: 'Drama / Romance',
    moviesUploaded: 0,
    submittedAt: 'Apr 26, 2026',
    portfolioUrl: 'duboiscinema.fr',
    bio: 'Award-winning French director known for intimate character studies and long-take cinematography.',
    idVerified: true,
  },
  {
    id: 'producer-003',
    name: 'Tobias Wren',
    email: 'tobias@wrenstudios.co.uk',
    company: 'Wren Studios',
    country: 'United Kingdom',
    genre: 'Horror / Sci-Fi',
    moviesUploaded: 0,
    submittedAt: 'Apr 25, 2026',
    portfolioUrl: 'wrenstudios.co.uk',
    bio: 'British genre filmmaker specializing in low-budget practical effects horror.',
    idVerified: false,
  },
];

export default function PendingProducersTable() {
  const [producers, setProducers] = useState<PendingProducer[]>(initialProducers);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject';
    producerId?: string;
    producerName?: string;
  }>({ isOpen: false, action: 'approve' });
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = producers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async () => {
    setIsProcessing(true);
    // Backend integration point: replace with Supabase update producer verification_status
    await new Promise((r) => setTimeout(r, 900));

    if (confirmModal.action === 'approve') {
      setProducers((prev) => prev.filter((p) => p.id !== confirmModal.producerId));
      toast.success(`${confirmModal.producerName} verified as a producer. They can now publish movies.`);
    } else {
      setProducers((prev) => prev.filter((p) => p.id !== confirmModal.producerId));
      toast.error(`${confirmModal.producerName}'s producer application rejected.`);
    }

    setIsProcessing(false);
    setConfirmModal({ isOpen: false, action: 'approve' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-600 text-foreground">Pending Producer Verifications</h2>
          <p className="text-sm text-muted-foreground">{producers.length} producer{producers.length !== 1 ? 's' : ''} awaiting identity and portfolio review</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search producer, company, country…"
          className="w-full pl-9 pr-3 py-2 text-sm input-field"
        />
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {['Producer', 'Company', 'Country', 'Genre Focus', 'Movies Queued', 'ID Verified', 'Applied', 'Actions'].map((col) => (
                  <th key={`th-prod-${col}`} className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider py-3 px-4 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Icon name="UserGroupIcon" size={32} className="mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-500 text-foreground mb-1">No pending producers</p>
                    <p className="text-xs text-muted-foreground">All producer applications have been reviewed.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((producer) => (
                  <React.Fragment key={producer.id}>
                    <tr
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === producer.id ? null : producer.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cinegate-navy to-cinegate-deep flex items-center justify-center text-white text-sm font-600 flex-shrink-0">
                            {producer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-600 text-foreground">{producer.name}</p>
                            <p className="text-xs text-muted-foreground">{producer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{producer.company}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground flex items-center gap-1.5">
                          {producer.country}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{producer.genre}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-600 tabular-nums ${producer.moviesUploaded > 0 ? 'text-cinegate-red' : 'text-muted-foreground'}`}>
                          {producer.moviesUploaded}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {producer.idVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-500 text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <Icon name="CheckBadgeIcon" size={12} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-500 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Icon name="ExclamationTriangleIcon" size={12} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">{producer.submittedAt}</td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <div className="tooltip-wrapper">
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, action: 'approve', producerId: producer.id, producerName: producer.name })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            >
                              <Icon name="CheckIcon" size={14} />
                            </button>
                            <span className="tooltip-label">Verify producer</span>
                          </div>
                          <div className="tooltip-wrapper">
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, action: 'reject', producerId: producer.id, producerName: producer.name })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            >
                              <Icon name="XMarkIcon" size={14} />
                            </button>
                            <span className="tooltip-label">Reject application</span>
                          </div>
                          <div className="tooltip-wrapper">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors">
                              <Icon name="ArrowTopRightOnSquareIcon" size={14} />
                            </button>
                            <span className="tooltip-label">View portfolio</span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded bio row */}
                    {expandedRow === producer.id && (
                      <tr key={`${producer.id}-expanded`} className="bg-muted/30">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="flex items-start gap-8">
                            <div className="flex-1">
                              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1.5">Bio</p>
                              <p className="text-sm text-foreground leading-relaxed">{producer.bio}</p>
                            </div>
                            <div className="flex gap-6 flex-shrink-0">
                              <div>
                                <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">Portfolio</p>
                                <a href={`https://${producer.portfolioUrl}`} target="_blank" rel="noopener noreferrer"
                                  className="text-sm text-cinegate-red hover:underline font-mono"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {producer.portfolioUrl}
                                </a>
                              </div>
                              <div>
                                <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">Producer ID</p>
                                <p className="text-xs font-mono text-muted-foreground">{producer.id}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.action === 'approve'
            ? `Verify "${confirmModal.producerName}" as a producer?`
            : `Reject "${confirmModal.producerName}"'s application?`
        }
        description={
          confirmModal.action === 'approve' ?'This producer will be verified and can immediately start uploading and publishing movies on CineGate.' :'This producer application will be rejected. They will be notified and may reapply after 30 days.'
        }
        confirmLabel={confirmModal.action === 'approve' ? 'Verify Producer' : 'Reject Application'}
        confirmVariant={confirmModal.action === 'reject' ? 'danger' : 'primary'}
        onConfirm={handleAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: 'approve' })}
        isLoading={isProcessing}
      />
    </div>
  );
}