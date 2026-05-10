import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { BookMarked, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { getJournals, deleteJournal } from '../services/journalService';

const MOODS = ['happy', 'sad', 'anxious', 'excited', 'calm', 'angry'];
const MOOD_EMOJI = { happy: '😊', sad: '😢', anxious: '😰', excited: '🤩', calm: '😌', angry: '😠' };
const PAGE_SIZE = 10;

const MyJournal = () => {
  const [page, setPage] = useState(0);
  const [activeMood, setActiveMood] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['journals', page],
    queryFn: () => getJournals({ page, size: PAGE_SIZE }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJournal,
    onSuccess: () => {
      toast.success('Entry deleted');
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: () => toast.error('Could not delete entry'),
  });

  const journals = (data?.content || []).filter(
    (j) => !activeMood || j.mood === activeMood
  );
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <Helmet>
        <title>My Journal — OpenJournal</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <BookMarked className="text-primary-400" size={28} />
                My Journal
              </h1>
              <p className="text-slate-400 text-sm mt-1">Private — only you can see this</p>
            </div>
            <Link to="/journal/new" id="new-journal-btn" className="btn-primary">
              <Plus size={16} /> New Entry
            </Link>
          </div>

          {/* Mood filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveMood('')}
              className={clsx(
                'badge px-3 py-1.5 border cursor-pointer transition-all',
                !activeMood ? 'bg-primary-600/30 text-primary-300 border-primary-600/50' : 'bg-slate-800 text-slate-400 border-slate-700'
              )}
            >
              All
            </button>
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMood(m === activeMood ? '' : m)}
                className={clsx(
                  'badge px-3 py-1.5 border cursor-pointer transition-all capitalize',
                  activeMood === m ? 'bg-primary-600/30 text-primary-300 border-primary-600/50' : 'bg-slate-800 text-slate-400 border-slate-700'
                )}
              >
                {MOOD_EMOJI[m]} {m}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <EmptyState title="Failed to load journal" description="Please try again." />
          ) : journals.length === 0 ? (
            <EmptyState
              type="journals"
              title="No journal entries yet"
              description={activeMood ? `No entries with mood "${activeMood}"` : 'Start capturing your thoughts and feelings.'}
              actionLabel="Write First Entry"
              actionTo="/journal/new"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {journals.map((j) => (
                <div key={j.id} className="relative group">
                  <JournalCard journal={j} />
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this journal entry?')) deleteMutation.mutate(j.id);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-danger-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-secondary py-2 px-3 disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <span className="text-slate-400 text-sm">Page {page + 1} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-secondary py-2 px-3 disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyJournal;
