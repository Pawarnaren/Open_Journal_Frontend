import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import {
  Heart, MessageCircle, Calendar, Clock, ArrowLeft,
  Edit2, Trash2, Send, Tag
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getBlogById, likeBlog, addComment, deleteBlog } from '../services/blogService';
import { cloudinaryUrl } from '../services/uploadService';
import { formatDate, readTime } from '../utils/formatDate';
import { stripHtml } from '../utils/truncateText';
import useAuth from '../hooks/useAuth';
import logger from '../utils/logger';

const MODULE = 'BlogDetail';

const BlogDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
    staleTime: 60_000,
  });

  // Like mutation with optimistic update
  const likeMutation = useMutation({
    mutationFn: () => likeBlog(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['blog', id] });
      const prev = queryClient.getQueryData(['blog', id]);
      queryClient.setQueryData(['blog', id], (old) => ({
        ...old,
        likeCount: (old?.likeCount || 0) + 1,
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['blog', id], ctx.prev);
      toast.error('Could not like blog');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['blog', id] }),
  });

  // Comment mutation with optimistic update
  const commentMutation = useMutation({
    mutationFn: (text) => addComment(id, text),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: ['blog', id] });
      const prev = queryClient.getQueryData(['blog', id]);
      const optimisticComment = {
        id: `temp-${Date.now()}`,
        content: text,
        author: { name: user?.name, id: user?.id },
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData(['blog', id], (old) => ({
        ...old,
        comments: [...(old?.comments || []), optimisticComment],
      }));
      return { prev };
    },
    onSuccess: () => {
      setComment('');
      toast.success('Comment added!');
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['blog', id], ctx.prev);
      toast.error('Could not add comment');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['blog', id] }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteBlog(id),
    onSuccess: () => {
      toast.success('Blog deleted');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
      navigate('/my-blogs');
    },
    onError: () => toast.error('Could not delete blog'),
  });

  const handleDelete = () => {
    if (window.confirm('Delete this blog permanently?')) {
      logger.warn(MODULE, `Deleting blog ${id}`);
      deleteMutation.mutate();
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!isAuthenticated) { toast.error('Sign in to comment'); return; }
    logger.debug(MODULE, 'Submitting comment');
    commentMutation.mutate(comment.trim());
  };

  if (isLoading) return <><Navbar /><Loader fullScreen text="Loading blog…" /></>;
  if (isError || !blog) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Blog not found or failed to load.</p>
          <Link to="/" className="btn-primary">← Back to Home</Link>
        </div>
      </div>
    </>
  );

  const isOwner = user?.id === blog.author?.id;
  const safeContent = DOMPurify.sanitize(blog.content || '');
  const readTimeStr = readTime(stripHtml(blog.content || ''));
  const heroUrl = blog.coverImagePublicId
    ? cloudinaryUrl(blog.coverImagePublicId, 'q_auto,f_auto,w_1200,h_600,c_fill')
    : blog.coverImageUrl;

  return (
    <>
      <Helmet>
        <title>{blog.title} — OpenJournal</title>
        <meta name="description" content={blog.excerpt || stripHtml(blog.content || '').slice(0, 160)} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || stripHtml(blog.content || '').slice(0, 160)} />
        {heroUrl && <meta property="og:image" content={heroUrl} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen pt-20">
        {/* Hero Image */}
        {heroUrl && (
          <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img src={heroUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
          {/* Back */}
          <Link to="/" className="btn-ghost mb-6 inline-flex text-xs">
            <ArrowLeft size={14} /> Back to Blogs
          </Link>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <span key={tag} className="badge bg-primary-950/60 text-primary-300 border border-primary-800/40">
                  <Tag size={10} />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                {blog.author?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="font-medium text-slate-300">{blog.author?.name}</span>
            </div>
            <span className="flex items-center gap-1"><Calendar size={13} />{formatDate(blog.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock size={13} />{readTimeStr}</span>
            <span className="flex items-center gap-1"><Heart size={13} />{blog.likeCount || 0} likes</span>
            <span className="flex items-center gap-1"><MessageCircle size={13} />{blog.comments?.length || 0} comments</span>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex gap-2 ml-auto">
                <Link to={`/edit-blog/${id}`} className="btn-ghost py-1.5 px-3 text-xs">
                  <Edit2 size={13} /> Edit
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                >
                  <Trash2 size={13} /> Delete
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          {/* Image Gallery */}
          {blog.images?.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blog.images.map((img, i) => (
                <img
                  key={i}
                  src={img.secure_url || img}
                  alt={`Blog image ${i + 1}`}
                  className="rounded-2xl w-full object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Like button */}
          <div className="mt-12 flex items-center gap-4">
            <button
              id="like-button"
              onClick={() => {
                if (!isAuthenticated) { toast.error('Sign in to like'); return; }
                likeMutation.mutate();
              }}
              disabled={likeMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:border-danger-600 hover:text-danger-400 text-slate-400 transition-all text-sm font-medium"
            >
              <Heart size={16} className={likeMutation.isPending ? 'fill-danger-500 text-danger-500' : ''} />
              {blog.likeCount || 0} Likes
            </button>
          </div>

          {/* Comments */}
          <section className="mt-12 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">
              Comments ({blog.comments?.length || 0})
            </h2>

            {/* Comment form */}
            <form onSubmit={handleComment} className="flex gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  id="comment-input"
                  type="text"
                  placeholder={isAuthenticated ? 'Add a comment…' : 'Sign in to comment'}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={!isAuthenticated}
                  className="input-base flex-1 py-2"
                />
                <Button
                  id="comment-submit"
                  type="submit"
                  loading={commentMutation.isPending}
                  disabled={!isAuthenticated || !comment.trim()}
                  size="sm"
                >
                  <Send size={14} />
                </Button>
              </div>
            </form>

            {/* Comment list */}
            <div className="space-y-5">
              {(blog.comments || []).map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                    {c.author?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 glass rounded-xl px-4 py-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200">{c.author?.name}</span>
                      <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
