import { Link } from 'react-router-dom';
import { BookOpen, Globe, MessageSquare } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-slate-800/60 bg-slate-950 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-100 text-lg">
              Open<span className="gradient-text">Journal</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            A space to write, share, and reflect. Public blogs. Private journals.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-slate-300 font-semibold text-sm mb-3">Platform</h4>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Browse Blogs' },
              { to: '/create-blog', label: 'Write a Blog' },
              { to: '/my-journal', label: 'My Journal' },
              { to: '/register', label: 'Join for Free' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-slate-300 font-semibold text-sm mb-3">Connect</h4>
          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-all"
              aria-label="GitHub"
            >
              <Globe size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-all"
              aria-label="Twitter"
            >
              <MessageSquare size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs">
        <span>© {new Date().getFullYear()} OpenJournal. Built for learning.</span>
        <span>React 19 + Vite + Spring Boot + MongoDB</span>
      </div>
    </div>
  </footer>
);

export default Footer;
