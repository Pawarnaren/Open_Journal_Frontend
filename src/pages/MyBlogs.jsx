import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { LayoutDashboard, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { getMyBlogs, deleteBlog } from '../services/blogService';
import { formatDate } from '../utils/formatDate';

const PAGE_SIZE = 9;

const MyBlogs = () => {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myBlogs', page],
    queryFn: () => getMyBlogs({ page, size: PAGE_SIZE }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted');
      queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: () => toast.error('Could not delete blog'),
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) deleteMutation.mutate(id);
  };

  const blogs = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <Helmet>
        <title>My Blogs — OpenJournal</title>
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <LayoutDashboard className="text-primary-400" size={28} />
                My Blogs
              </h1>
              {data && (
                <p className="text-slate-400 text-sm mt-1">
                  {data.totalElements} {data.totalElements === 1 ? 'blog' : 'blogs'} published
                </p>
              )}
            </div>
            <Link to="/create-blog" id="myblogs-create-btn" className="btn-primary">
              <Plus size={16} /> New Blog
            </Link>
          </div>

          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : isError ? (
            <EmptyState title="Failed to load blogs" description="Please refresh and try again." />
          ) : blogs.length === 0 ? (
            <EmptyState
              type="blogs"
              title="You haven't written anything yet"
              description="Share your first blog with the world!"
              actionLabel="Write Your First Blog"
              actionTo="/create-blog"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div key={blog.id} className="relative group">
                    <BlogCard blog={blog} />
                    {/* Quick action overlay */}
                    <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Link
                        to={`/edit-blog/${blog.id}`}
                        className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700 flex items-center justify-center text-slate-300 hover:text-primary-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id, blog.title)}
                        disabled={deleteMutation.isPending}
                        className="w-8 h-8 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700 flex items-center justify-center text-slate-300 hover:text-danger-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="btn-secondary py-2 px-3 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-slate-400 text-sm">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="btn-secondary py-2 px-3 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyBlogs;
