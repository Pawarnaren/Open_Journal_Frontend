import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { User, BookOpen, BookMarked, PenSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import JournalCard from '../components/JournalCard';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { getMyBlogs } from '../services/blogService';
import { getJournals } from '../services/journalService';
import { formatDate } from '../utils/formatDate';

const Profile = () => {
  const { user } = useAuth();

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['myBlogs', 0],
    queryFn: () => getMyBlogs({ page: 0, size: 3 }),
    staleTime: 60_000,
  });

  const { data: journalData, isLoading: journalsLoading } = useQuery({
    queryKey: ['journals', 0],
    queryFn: () => getJournals({ page: 0, size: 3 }),
    staleTime: 60_000,
  });

  const blogs = blogsData?.content || [];
  const journals = journalData?.content || [];

  return (
    <>
      <Helmet>
        <title>Profile — OpenJournal</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Profile Card */}
          <div className="glass-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-fade-in">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl flex-shrink-0 overflow-hidden ${user?.avatarUrl ? 'bg-gradient-to-br from-primary-600 to-violet-600 shadow-primary-900/40' : 'bg-white shadow-slate-900/40'}`}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <img
                  src="https://imgs.search.brave.com/J9r5OmlaohZhHhIXBYi5g_ya7O8L8Jt9jA1HgVw3dg4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDUv/NTQ0LzcxOC9zbWFs/bC9wcm9maWxlLWlj/b24tZGVzaWduLWZy/ZWUtdmVjdG9yLmpw/Zw"
                  alt="Default Avatar"
                  className="w-full h-full object-cover scale-110 transition-transform hover:scale-125"
                />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-100">{user?.name}</h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
              <p className="text-slate-500 text-xs mt-1">
                Member since {formatDate(user?.createdAt || new Date().toISOString())}
              </p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-100">{blogsData?.totalElements || 0}</p>
                  <p className="text-slate-500 text-xs">Blogs</p>
                </div>
                <div className="w-px bg-slate-800" />
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-100">{journalData?.totalElements || 0}</p>
                  <p className="text-slate-500 text-xs">Journal Entries</p>
                </div>
              </div>
            </div>
            <Link to="/create-blog" className="btn-primary flex-shrink-0">
              <PenSquare size={15} />
              Write Blog
            </Link>
          </div>

          {/* Recent Blogs */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <BookOpen size={18} className="text-primary-400" />
                Recent Blogs
              </h2>
              <Link to="/my-blogs" className="btn-ghost text-xs">View all →</Link>
            </div>
            {blogsLoading ? (
              <Loader />
            ) : blogs.length === 0 ? (
              <p className="text-slate-500 text-sm">No blogs yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
              </div>
            )}
          </section>

          {/* Recent Journal */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <BookMarked size={18} className="text-primary-400" />
                Recent Journal
              </h2>
              <Link to="/my-journal" className="btn-ghost text-xs">View all →</Link>
            </div>
            {journalsLoading ? (
              <Loader />
            ) : journals.length === 0 ? (
              <p className="text-slate-500 text-sm">No journal entries yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {journals.map((j) => <JournalCard key={j.id} journal={j} />)}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
