import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { BookMarked } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';
import { createJournal } from '../services/journalService';
import logger from '../utils/logger';

const MODULE = 'CreateJournal';

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Happy', color: 'border-yellow-600/60 text-yellow-300 bg-yellow-950/30' },
  { key: 'sad', emoji: '😢', label: 'Sad', color: 'border-blue-600/60 text-blue-300 bg-blue-950/30' },
  { key: 'anxious', emoji: '😰', label: 'Anxious', color: 'border-orange-600/60 text-orange-300 bg-orange-950/30' },
  { key: 'excited', emoji: '🤩', label: 'Excited', color: 'border-pink-600/60 text-pink-300 bg-pink-950/30' },
  { key: 'calm', emoji: '😌', label: 'Calm', color: 'border-teal-600/60 text-teal-300 bg-teal-950/30' },
  { key: 'angry', emoji: '😠', label: 'Angry', color: 'border-red-600/60 text-red-300 bg-red-950/30' },
];

const schema = z.object({
  title: z.string().min(1, 'Give your entry a title').max(200),
  content: z.string().min(1, 'Write something…'),
  mood: z.string().optional(),
});

const CreateJournal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { uploads, uploading, addFiles, removeFile, reset: resetUploads } = useCloudinaryUpload();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const selectedMood = watch('mood');

  const mutation = useMutation({
    mutationFn: createJournal,
    onSuccess: (data) => {
      toast.success('Journal entry saved ✨');
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      resetUploads();
      navigate(`/journal/${data.id}`);
    },
    onError: (err) => {
      logger.error(MODULE, 'Create journal failed', err.message);
      toast.error('Failed to save entry');
    },
  });

  const onSubmit = (data) => {
    if (uploading) { toast.error('Please wait for uploads to finish'); return; }

    const successUploads = uploads.filter((u) => u.result);
    const payload = {
      title: data.title,
      content: data.content,
      mood: data.mood || null,
      images: successUploads.map((u) => ({
        public_id: u.result.public_id,
        secure_url: u.result.secure_url,
      })),
    };

    logger.info(MODULE, 'Saving journal entry', { mood: payload.mood });
    console.log('JOURNAL PAYLOAD TO BACKEND:', JSON.stringify(payload, null, 2));
    mutation.mutate(payload);
  };

  return (
    <>
      <Helmet>
        <title>New Journal Entry — OpenJournal</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <BookMarked className="text-primary-400" size={26} />
              New Entry
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              This is private. Write freely.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="glass-card p-6 space-y-5">
              <Input
                id="journal-title"
                label="Title"
                placeholder="What's on your mind today?"
                error={errors.title?.message}
                {...register('title')}
              />

              {/* Mood selector */}
              <div>
                <label className="label">How are you feeling?</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MOODS.map(({ key, emoji, label, color }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setValue('mood', selectedMood === key ? '' : key)}
                      className={clsx(
                        'px-3 py-1.5 rounded-xl border text-sm font-medium transition-all',
                        selectedMood === key
                          ? color
                          : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300 bg-transparent'
                      )}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="glass-card p-6">
              <label className="label mb-3">Your Thoughts</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    height={450}
                    data-color-mode="dark"
                    id="journal-content"
                  />
                )}
              />
              {errors.content && <p className="error-msg mt-2">{errors.content.message}</p>}
            </div>

            {/* Images */}
            <div className="glass-card p-6">
              <label className="label mb-3">Attach Images (up to 5)</label>
              <ImageUploader
                uploads={uploads}
                uploading={uploading}
                onDrop={addFiles}
                onRemove={removeFile}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
              <Button
                id="save-journal-btn"
                type="submit"
                loading={isSubmitting || mutation.isPending}
                disabled={uploading}
              >
                Save Entry
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CreateJournal;
