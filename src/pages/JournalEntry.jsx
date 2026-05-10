import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Edit2, Trash2, Calendar } from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getJournalById, deleteJournal } from '../services/journalService';
import { formatDate } from '../utils/formatDate';

const MOOD_CONFIG = {
  happy: { emoji: '😊', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-700/40' },
  sad: { emoji: '😢', color: 'bg-blue-500/20 text-blue-300 border-blue-700/40' },
  anxious: { emoji: '😰', color: 'bg-orange-500/20 text-orange-300 border-orange-700/40' },
  excited: { emoji: '🤩', color: 'bg-pink-500/20 text-pink-300 border-pink-700/40' },
  calm: { emoji: '😌', color: 'bg-teal-500/20 text-teal-300 border-teal-700/40' },
  angry: { emoji: '😠', color: 'bg-red-500/20 text-red-300 border-red-700/40' },
};

const JournalEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entry, isLoading, isError } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => getJournalById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJournal(id),
    onSuccess: () => {
      toast.success('Entry deleted');
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      navigate('/my-journal');
    },
    onError: () => toast.error('Could not delete entry'),
  });

  if (isLoading) return <><Navbar /><Loader fullScreen text="Loading entry…" /></>;
  if (isError || !entry) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Entry not found.</p>
          <Link to="/my-journal" className="btn-primary">← Back to Journal</Link>
        </div>
      </div>
    </>
  );

  const moodInfo = MOOD_CONFIG[entry.mood] || null;
  const safeContent = DOMPurify.sanitize(entry.content || '');

  return (
    <>
      <Helmet>
        <title>{entry.title || 'Journal Entry'} — OpenJournal</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/my-journal" className="btn-ghost mb-6 inline-flex text-xs">
            <ArrowLeft size={14} /> Back to Journal
          </Link>

          <div className="glass-card p-8 space-y-6 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-100">
                  {entry.title || 'Untitled Entry'}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-slate-500 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(entry.createdAt, 'PPP p')}
                  </span>
                  {moodInfo && (
                    <span className={`badge border ${moodInfo.color}`}>
                      {moodInfo.emoji} {entry.mood}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toast('Edit coming soon')}
                  className="btn-ghost py-1.5 px-2.5 text-xs"
                >
                  <Edit2 size={13} />
                </button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => { if (window.confirm('Delete this entry?')) deleteMutation.mutate(); }}
                  loading={deleteMutation.isPending}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>

            <div
              className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {entry.images?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                {entry.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.secure_url || img}
                    alt={`Entry image ${i + 1}`}
                    className="rounded-xl w-full aspect-square object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default JournalEntry;
