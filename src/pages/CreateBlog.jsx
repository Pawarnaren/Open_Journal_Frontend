import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import { PenSquare, X } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';
import { createBlog } from '../services/blogService';
import logger from '../utils/logger';

const MODULE = 'CreateBlog';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  tags: z.string().optional(),
});

const CreateBlog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { uploads, uploading, addFiles, removeFile, reset: resetUploads } = useCloudinaryUpload();
  const [coverIdx, setCoverIdx] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (data) => {
      toast.success('Blog published!');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
      resetUploads();
      navigate(`/blog/${data.id}`);
    },
    onError: (err) => {
      logger.error(MODULE, 'Create blog failed', err.message);
      toast.error(err.response?.data?.message || 'Failed to publish blog');
    },
  });

  const onSubmit = (data) => {
    if (uploading) { toast.error('Please wait for uploads to finish'); return; }

    const successUploads = uploads.filter((u) => u.result);
    const coverImage = successUploads[coverIdx] || successUploads[0] || null;
    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: tagsArray,
      coverImagePublicId: coverImage?.result?.public_id || null,
      coverImageUrl: coverImage?.result?.secure_url || null,
      images: successUploads.map((u) => ({
        public_id: u.result.public_id,
        secure_url: u.result.secure_url,
      })),
    };

    logger.info(MODULE, 'Submitting blog payload', { title: payload.title, tags: payload.tags });
    mutation.mutate(payload);
  };

  return (
    <>
      <Helmet>
        <title>Write a Blog — OpenJournal</title>
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <PenSquare className="text-primary-400" size={28} />
              Write a Blog
            </h1>
            <p className="text-slate-400 text-sm mt-1">Share your ideas with the world</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="create-blog-form">
            <div className="glass-card p-6 space-y-5">
              <Input
                id="blog-title"
                label="Title *"
                placeholder="An interesting title that grabs attention…"
                error={errors.title?.message}
                {...register('title')}
              />
              <Input
                id="blog-excerpt"
                label="Excerpt (optional)"
                placeholder="A short summary shown in blog cards…"
                error={errors.excerpt?.message}
                {...register('excerpt')}
              />
              <Input
                id="blog-tags"
                label="Tags (comma-separated)"
                placeholder="react, javascript, tutorial"
                {...register('tags')}
              />
            </div>

            {/* MD Editor */}
            <div className="glass-card p-6">
              <label className="label mb-3">Content *</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    height={400}
                    data-color-mode="dark"
                    id="blog-content"
                  />
                )}
              />
              {errors.content && (
                <p className="error-msg mt-2">{errors.content.message}</p>
              )}
            </div>

            {/* Image Uploader */}
            <div className="glass-card p-6">
              <label className="label mb-3">Images (optional)</label>
              <ImageUploader
                uploads={uploads}
                uploading={uploading}
                onDrop={addFiles}
                onRemove={removeFile}
              />
              {uploads.filter((u) => u.result).length > 1 && (
                <div className="mt-4">
                  <p className="label">Cover image</p>
                  <div className="flex flex-wrap gap-2">
                    {uploads.filter((u) => u.result).map((u, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCoverIdx(i)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          coverIdx === i ? 'border-primary-500' : 'border-slate-700'
                        }`}
                      >
                        <img src={u.preview} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                id="publish-blog-btn"
                type="submit"
                loading={isSubmitting || mutation.isPending}
                disabled={uploading}
              >
                Publish Blog
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CreateBlog;
