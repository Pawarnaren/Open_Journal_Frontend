import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';

const NotFound = () => (
  <>
    <Helmet>
      <title>404 Not Found — OpenJournal</title>
    </Helmet>

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Giant 404 */}
        <div className="relative">
          <p className="text-[10rem] sm:text-[14rem] font-black text-slate-900 select-none leading-none">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-black gradient-text select-none leading-none opacity-30">
            404
          </p>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-100">Page not found</h1>
          <p className="text-slate-400 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  </>
);

export default NotFound;
