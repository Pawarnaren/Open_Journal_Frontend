import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, Tag, ChevronLeft, ChevronRight, PenSquare, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import JournalCard from '../components/JournalCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { getBlogs, getTags } from '../services/blogService';
import { getJournals } from '../services/journalService';
import { BlogContext } from '../context/BlogContext';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 9;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { activeTag, applyTag, currentPage, setCurrentPage } = useContext(BlogContext);
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 350);

  // Blogs query
  const {
    data: blogsData,
    isLoading: blogsLoading,
    isError: blogsError,
    isFetching,
  } = useQuery({
    queryKey: ['blogs', currentPage, debouncedSearch, activeTag],
    queryFn: () => getBlogs({ page: currentPage, size: PAGE_SIZE, search: debouncedSearch, tag: activeTag }),
    keepPreviousData: true,
    staleTime: 60_000,
  });

  // Tags query
  const { data: tags = [] } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: getTags,
    staleTime: 300_000,
  });

  // Journals (only if authenticated)
  const { data: journalData } = useQuery({
    queryKey: ['journals', 0],
    queryFn: () => getJournals({ page: 0, size: 4 }),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const blogs = blogsData?.content || [];
  const totalPages = blogsData?.totalPages || 0;
  const journals = journalData?.content || [];

  const handleSearch = (q) => setLocalSearch(q);

  return (
    <>
      <Helmet>
        <title>OpenJournal — Write. Share. Reflect.</title>
        <meta
          name="description"
          content="Discover public blogs and keep a private journal. OpenJournal is your personal writing space."
        />
        <meta property="og:title" content="OpenJournal — Write. Share. Reflect." />
        <meta
          property="og:description"
          content="Discover public blogs and keep a private journal on OpenJournal."
        />
      </Helmet>

      <Navbar onSearch={handleSearch} />

      <main className="min-h-screen">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Glow backgrounds */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-950/60 border border-primary-800/50 text-primary-300 text-xs font-medium mb-6">
              <Sparkles size={12} />
              Your writing space, your rules
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-100 leading-tight mb-6 text-balance">
              Write what{' '}
              <span className="gradient-text">matters</span>
              <br />
              to you
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Share your ideas with the world through public blogs, or capture raw thoughts in your
              completely private journal — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/create-blog" className="btn-primary text-base px-8 py-3">
                <PenSquare size={16} />
                Start Writing
              </Link>
              <a href="#blogs" className="btn-secondary text-base px-8 py-3">
                Explore Blogs
              </a>
            </div>
          </div>
        </section>

        {/* ── Blog Section ─────────────────────────────────────────────── */}
        <section id="blogs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Latest Blogs</h2>
            {isFetching && !blogsLoading && (
              <span className="text-xs text-primary-400 animate-pulse">Updating…</span>
            )}
          </div>

          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                id="home-search"
                type="text"
                placeholder="Search by title or content…"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(0);
                }}
                className="input-base pl-9"
              />
            </div>

            {/* Tag filter chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => applyTag('')}
                  className={clsx(
                    'badge px-3 py-1.5 cursor-pointer border transition-all',
                    !activeTag
                      ? 'bg-primary-600/30 text-primary-300 border-primary-600/50'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                  )}
                >
                  All
                </button>
                {tags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => applyTag(tag)}
                    className={clsx(
                      'badge px-3 py-1.5 cursor-pointer border transition-all',
                      activeTag === tag
                        ? 'bg-primary-600/30 text-primary-300 border-primary-600/50'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600'
                    )}
                  >
                    <Tag size={10} />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Blog Grid */}
          {blogsLoading ? (
            <SkeletonGrid count={PAGE_SIZE} />
          ) : blogsError ? (
            <EmptyState
              title="Failed to load blogs"
              description="Could not reach the server. Please check your connection and try again."
            />
          ) : blogs.length === 0 ? (
            <EmptyState
              type="blogs"
              title="No blogs found"
              description={
                debouncedSearch || activeTag
                  ? 'Try a different search term or tag.'
                  : 'Be the first to publish!'
              }
              actionLabel="Write the First Blog"
              actionTo="/create-blog"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                id="home-prev-page"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="btn-secondary py-2 px-3 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={clsx(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                      i === currentPage
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                id="home-next-page"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="btn-secondary py-2 px-3 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* ── Journal Preview (authenticated only) ──────────────────── */}
        {isAuthenticated && journals.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/60">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Recent Journal Entries</h2>
              <Link to="/my-journal" className="btn-ghost text-xs">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {journals.map((j) => (
                <JournalCard key={j.id} journal={j} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Home;
