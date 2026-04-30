'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

import ConfirmModal from '@/components/ui/ConfirmModal';

interface PendingMovie {
  id: string;
  title: string;
  producer: string;
  producerCompany: string;
  genre: string;
  duration: string;
  price: string;
  submittedAt: string;
  fileSize: string;
  language: string;
  rating: string;
  synopsis: string;
}

const initialMovies: PendingMovie[] = [
  { id: 'movie-001', title: 'The Hollow Meridian', producer: 'Soren Blackwell', producerCompany: 'Blackwell Films', genre: 'Thriller', duration: '1h 48m', price: '$7.99', submittedAt: 'Apr 27, 2026', fileSize: '4.2 GB', language: 'English', rating: 'R', synopsis: 'A disgraced detective uncovers a conspiracy spanning three continents.' },
  { id: 'movie-002', title: 'Echoes of Basra', producer: 'Layla Al-Rashidi', producerCompany: 'Desert Lens Cinema', genre: 'Drama', duration: '2h 04m', price: '$9.99', submittedAt: 'Apr 26, 2026', fileSize: '5.8 GB', language: 'Arabic', rating: 'PG-13', synopsis: 'A family separated by war reconnects through letters discovered 30 years later.' },
  { id: 'movie-003', title: 'Fluorescent Nights', producer: 'Maya Rivera', producerCompany: 'Studio Indigo', genre: 'Drama', duration: '1h 33m', price: '$5.99', submittedAt: 'Apr 26, 2026', fileSize: '3.1 GB', language: 'Spanish', rating: 'PG-13', synopsis: 'A coming-of-age story set in the neon-lit streets of 1990s Buenos Aires.' },
  { id: 'movie-004', title: 'Sector 9 Rising', producer: 'Kwame Asante', producerCompany: 'Accra Motion Pictures', genre: 'Sci-Fi', duration: '2h 17m', price: '$12.99', submittedAt: 'Apr 25, 2026', fileSize: '7.4 GB', language: 'English', rating: 'PG-13', synopsis: 'In 2047, a mining colony on Mars discovers something buried beneath the regolith.' },
  { id: 'movie-005', title: 'Last Train to Varna', producer: 'Petra Voronova', producerCompany: 'Black Sea Films', genre: 'Documentary', duration: '1h 22m', price: '$4.99', submittedAt: 'Apr 25, 2026', fileSize: '2.6 GB', language: 'Bulgarian', rating: 'NR', synopsis: 'A documentary following passengers on the last overnight rail service through Eastern Europe.' },
  { id: 'movie-006', title: 'Monsoon Protocol', producer: 'Arjun Mehta', producerCompany: 'Mehta Films', genre: 'Action', duration: '1h 57m', price: '$8.99', submittedAt: 'Apr 24, 2026', fileSize: '5.1 GB', language: 'Hindi', rating: 'R', synopsis: 'A covert agent must neutralize a bioweapon threat during the Mumbai monsoon season.' },
  { id: 'movie-007', title: 'The Cartographer\'s Daughter', producer: 'Elise Fontaine', producerCompany: 'Fontaine Cinéma', genre: 'Drama', duration: '1h 44m', price: '$6.99', submittedAt: 'Apr 24, 2026', fileSize: '3.9 GB', language: 'French', rating: 'PG', synopsis: 'A young woman inherits her late father\'s maps and embarks on a journey across Provence.' },
];

const genreColors: Record<string, string> = {
  Thriller: 'bg-red-50 text-red-700',
  Drama: 'bg-blue-50 text-blue-700',
  'Sci-Fi': 'bg-indigo-50 text-indigo-700',
  Documentary: 'bg-teal-50 text-teal-700',
  Action: 'bg-orange-50 text-orange-700',
  Comedy: 'bg-yellow-50 text-yellow-700',
};

export default function PendingMoviesTable() {
  const [movies, setMovies] = useState<PendingMovie[]>(initialMovies);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'bulk-approve' | 'bulk-reject';
    movieId?: string;
    movieTitle?: string;
  }>({ isOpen: false, action: 'approve' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const genres = ['all', ...Array.from(new Set(initialMovies.map((m) => m.genre)))];

  const filtered = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === 'all' || m.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((m) => m.id)));
    }
  };

  const handleAction = async () => {
    setIsProcessing(true);
    // Backend integration point: replace with Supabase update movie status
    await new Promise((r) => setTimeout(r, 900));

    if (confirmModal.action === 'approve' && confirmModal.movieId) {
      setMovies((prev) => prev.filter((m) => m.id !== confirmModal.movieId));
      toast.success(`"${confirmModal.movieTitle}" approved and published.`);
    } else if (confirmModal.action === 'reject' && confirmModal.movieId) {
      setMovies((prev) => prev.filter((m) => m.id !== confirmModal.movieId));
      toast.error(`"${confirmModal.movieTitle}" rejected and removed from queue.`);
    } else if (confirmModal.action === 'bulk-approve') {
      setMovies((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      toast.success(`${selectedIds.size} movie${selectedIds.size > 1 ? 's' : ''} approved and published.`);
      setSelectedIds(new Set());
    } else if (confirmModal.action === 'bulk-reject') {
      setMovies((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      toast.error(`${selectedIds.size} movie${selectedIds.size > 1 ? 's' : ''} rejected.`);
      setSelectedIds(new Set());
    }

    setIsProcessing(false);
    setConfirmModal({ isOpen: false, action: 'approve' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-600 text-foreground">Pending Movie Submissions</h2>
          <p className="text-sm text-muted-foreground">{movies.length} movie{movies.length !== 1 ? 's' : ''} awaiting content review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search title, producer…"
            className="w-full pl-9 pr-3 py-2 text-sm input-field"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {genres.map((genre) => (
            <button
              key={`genre-${genre}`}
              onClick={() => { setGenreFilter(genre); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-500 rounded-lg border transition-all duration-150 ${
                genreFilter === genre
                  ? 'border-cinegate-red bg-red-50 text-cinegate-red' :'border-border bg-white text-muted-foreground hover:border-cinegate-red/40 hover:text-foreground'
              }`}
            >
              {genre === 'all' ? 'All Genres' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-cinegate-navy text-white border-b border-cinegate-blue slide-up">
            <p className="text-sm font-500">{selectedIds.size} movie{selectedIds.size > 1 ? 's' : ''} selected</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal({ isOpen: true, action: 'bulk-approve' })}
                className="px-3 py-1.5 text-xs font-600 bg-green-500 hover:bg-green-400 rounded-lg transition-colors"
              >
                Approve All Selected
              </button>
              <button
                onClick={() => setConfirmModal({ isOpen: true, action: 'bulk-reject' })}
                className="px-3 py-1.5 text-xs font-600 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
              >
                Reject All Selected
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 text-xs font-500 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="w-10 py-3 pl-4 pr-2">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.size === paginated.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border accent-cinegate-red"
                  />
                </th>
                {['Title & Producer', 'Genre', 'Duration', 'Price', 'Language', 'Rating', 'Submitted', 'Actions'].map((col) => (
                  <th key={`th-${col}`} className="text-left text-xs font-600 text-muted-foreground uppercase tracking-wider py-3 px-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Icon name="FilmIcon" size={32} className="mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-500 text-foreground mb-1">No pending movies</p>
                    <p className="text-xs text-muted-foreground">All movie submissions have been reviewed.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((movie) => (
                  <React.Fragment key={movie.id}>
                    <tr
                      className={`hover:bg-muted/40 transition-colors cursor-pointer ${
                        selectedIds.has(movie.id) ? 'bg-red-50/30' : ''
                      }`}
                      onClick={() => setExpandedRow(expandedRow === movie.id ? null : movie.id)}
                    >
                      <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(movie.id)}
                          onChange={() => toggleSelect(movie.id)}
                          className="w-4 h-4 rounded border-border accent-cinegate-red"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-gradient-to-br from-cinegate-navy to-cinegate-deep rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon name="FilmIcon" size={16} className="text-white/60" />
                          </div>
                          <div>
                            <p className="text-sm font-600 text-foreground">{movie.title}</p>
                            <p className="text-xs text-muted-foreground">{movie.producer}</p>
                            <p className="text-xs text-muted-foreground/70">{movie.producerCompany}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-500 px-2.5 py-1 rounded-full ${genreColors[movie.genre] || 'bg-gray-100 text-gray-600'}`}>
                          {movie.genre}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-foreground tabular-nums font-mono">{movie.duration}</td>
                      <td className="py-3 px-3 text-sm font-600 text-foreground tabular-nums">{movie.price}</td>
                      <td className="py-3 px-3 text-sm text-foreground">{movie.language}</td>
                      <td className="py-3 px-3">
                        <span className="text-xs font-600 px-2 py-0.5 rounded border border-gray-300 text-gray-600 bg-gray-50">{movie.rating}</span>
                      </td>
                      <td className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">{movie.submittedAt}</td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <div className="tooltip-wrapper">
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, action: 'approve', movieId: movie.id, movieTitle: movie.title })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            >
                              <Icon name="CheckIcon" size={14} />
                            </button>
                            <span className="tooltip-label">Approve movie</span>
                          </div>
                          <div className="tooltip-wrapper">
                            <button
                              onClick={() => setConfirmModal({ isOpen: true, action: 'reject', movieId: movie.id, movieTitle: movie.title })}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            >
                              <Icon name="XMarkIcon" size={14} />
                            </button>
                            <span className="tooltip-label">Reject movie</span>
                          </div>
                          <div className="tooltip-wrapper">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors">
                              <Icon name="PlayIcon" size={14} />
                            </button>
                            <span className="tooltip-label">Preview movie</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded row */}
                    {expandedRow === movie.id && (
                      <tr key={`${movie.id}-expanded`} className="bg-muted/30">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="flex items-start gap-6">
                            <div className="flex-1">
                              <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1.5">Synopsis</p>
                              <p className="text-sm text-foreground leading-relaxed">{movie.synopsis}</p>
                            </div>
                            <div className="flex gap-6 flex-shrink-0">
                              <div>
                                <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">File Size</p>
                                <p className="text-sm font-mono text-foreground">{movie.fileSize}</p>
                              </div>
                              <div>
                                <p className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">Movie ID</p>
                                <p className="text-xs font-mono text-muted-foreground">{movie.id}</p>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} movies
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="ChevronLeftIcon" size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={`page-${i + 1}`}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-500 transition-colors ${
                    currentPage === i + 1
                      ? 'bg-cinegate-red text-white' :'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="ChevronRightIcon" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.action === 'approve' ? `Approve "${confirmModal.movieTitle}"?` :
          confirmModal.action === 'reject' ? `Reject "${confirmModal.movieTitle}"?` :
          confirmModal.action === 'bulk-approve' ? `Approve ${selectedIds.size} movies?` :
          `Reject ${selectedIds.size} movies?`
        }
        description={
          confirmModal.action === 'approve' ? 'This movie will be published on the platform and become purchasable by viewers.' :
          confirmModal.action === 'reject' ? 'This movie will be rejected and the producer will be notified. This action cannot be undone.' :
          confirmModal.action === 'bulk-approve' ? `All ${selectedIds.size} selected movies will be published on the platform.` :
          `All ${selectedIds.size} selected movies will be rejected. Producers will be notified.`
        }
        confirmLabel={confirmModal.action.includes('approve') ? 'Approve' : 'Reject'}
        confirmVariant={confirmModal.action.includes('reject') ? 'danger' : 'primary'}
        onConfirm={handleAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: 'approve' })}
        isLoading={isProcessing}
      />
    </div>
  );
}