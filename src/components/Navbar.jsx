import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  BookOpen,
  PenSquare,
  LayoutDashboard,
  BookMarked,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Search,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: BookOpen, end: true },
  { to: '/my-blogs', label: 'My Blogs', icon: LayoutDashboard, protected: true },
  { to: '/my-journal', label: 'Journal', icon: BookMarked, protected: true },
];

const Navbar = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchValue.trim());
    navigate('/');
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const visibleLinks = NAV_LINKS.filter((l) => !l.protected || isAuthenticated);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/80 shadow-xl shadow-slate-950/50'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" id="nav-logo">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:scale-110 transition-transform">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-100 text-lg tracking-tight hidden sm:block">
            Open<span className="gradient-text">Journal</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              id="navbar-search"
              type="text"
              placeholder="Search blogs…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="input-base pl-9 py-2 text-xs h-9"
            />
          </div>
        </form>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {visibleLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              id={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
              className={({ isActive }) =>
                clsx(
                  'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-600/20 text-primary-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <Link to="/create-blog" id="nav-create-blog" className="btn-primary py-2 px-4 text-xs">
                <PenSquare size={13} />
                Write
              </Link>
              <Link to="/profile" id="nav-profile" className="btn-ghost py-2 px-3 text-xs">
                <User size={13} />
                {user?.name?.split(' ')[0] || 'Profile'}
              </Link>
              <button id="nav-logout" onClick={handleLogout} className="btn-ghost py-2 px-3 text-xs text-danger-400 hover:text-danger-300">
                <LogOut size={13} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" id="nav-login" className="btn-ghost py-2 px-4 text-xs">
                <LogIn size={13} />
                Log in
              </Link>
              <Link to="/register" id="nav-register" className="btn-primary py-2 px-4 text-xs">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto md:hidden btn-ghost p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/60 px-4 py-4 space-y-3 animate-fade-in">
          {/* Mobile search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search blogs…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="input-base pl-9 py-2.5 text-sm"
              />
            </div>
          </form>

          {/* Mobile links */}
          {visibleLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-600/20 text-primary-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          <div className="border-t border-slate-800 pt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-blog"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  <PenSquare size={14} />
                  Write a Blog
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary w-full justify-center"
                >
                  <User size={14} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-ghost w-full justify-center text-danger-400 hover:text-danger-300"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary w-full justify-center">
                  <LogIn size={14} />
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
