import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import { Edit2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { getBlogById, updateBlog } from '../services/blogService';
import logger from '../utils/logger';

const MODULE = 'EditBlog';

const schema = z.object({
  title: z.string().min(5).max(150),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(50, 'Content too short'),
  tags: z.string().optional(),
});

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        tags: (blog.tags || []).join(', '),
      });
    }
  }, [blog, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => updateBlog(id, payload),
    onSuccess: (data) => {
      toast.success('Blog updated!');
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
      navigate(`/blog/${id}`);
    },
    onError: (err) => {
      logger.error(MODULE, 'Update failed', err.message);
      toast.error('Failed to update blog');
    },
  });

  const onSubmit = (data) => {
    const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    logger.info(MODULE, `Updating blog ${id}`, { title: data.title });
    mutation.mutate({ ...data, tags: tagsArray });
  };

  if (isLoading) return <><Navbar /><Loader fullScreen text="Loading blog…" /></>;

  return (
    <>
      <Helmet>
        <title>Edit Blog — OpenJournal</title>
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Edit2 className="text-primary-400" size={26} />
              Edit Blog
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="glass-card p-6 space-y-5">
              <Input id="edit-title" label="Title *" error={errors.title?.message} {...register('title')} />
              <Input id="edit-excerpt" label="Excerpt" error={errors.excerpt?.message} {...register('excerpt')} />
              <Input id="edit-tags" label="Tags (comma-separated)" {...register('tags')} />
            </div>

            <div className="glass-card p-6">
              <label className="label mb-3">Content *</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={field.onChange} height={400} data-color-mode="dark" />
                )}
              />
              {errors.content && <p className="error-msg mt-2">{errors.content.message}</p>}
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
              <Button id="save-blog-btn" type="submit" loading={isSubmitting || mutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EditBlog;
