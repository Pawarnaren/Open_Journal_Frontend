import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const Loader = ({ fullScreen = false, size = 32, text = '' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
        <Loader2 size={size} className="text-primary-400 animate-spin" />
        {text && <p className="text-slate-400 text-sm">{text}</p>}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 py-16',
        fullScreen && 'h-full'
      )}
    >
      <Loader2 size={size} className="text-primary-400 animate-spin" />
      {text && <p className="text-slate-400 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
