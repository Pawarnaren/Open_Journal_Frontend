import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import { truncateText } from '../utils/truncateText';

const MOOD_CONFIG = {
  happy: { emoji: '😊', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-700/40' },
  sad: { emoji: '😢', color: 'bg-blue-500/20 text-blue-300 border-blue-700/40' },
  anxious: { emoji: '😰', color: 'bg-orange-500/20 text-orange-300 border-orange-700/40' },
  excited: { emoji: '🤩', color: 'bg-pink-500/20 text-pink-300 border-pink-700/40' },
  calm: { emoji: '😌', color: 'bg-teal-500/20 text-teal-300 border-teal-700/40' },
  angry: { emoji: '😠', color: 'bg-red-500/20 text-red-300 border-red-700/40' },
};

const JournalCard = ({ journal }) => {
  const { id, title, content = '', mood, createdAt, images = [] } = journal;
  const moodInfo = MOOD_CONFIG[mood] || { emoji: '📝', color: 'bg-slate-700/40 text-slate-300 border-slate-600/40' };

  return (
    <Link
      to={`/journal/${id}`}
      id={`journal-card-${id}`}
      className="group card flex flex-col gap-3 no-underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-2xl"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-slate-100 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors flex-1">
          {title || 'Untitled Entry'}
        </h3>
        {mood && (
          <span
            className={`badge border flex-shrink-0 ${moodInfo.color}`}
          >
            {moodInfo.emoji} {mood}
          </span>
        )}
      </div>

      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
        {truncateText(content, 150)}
      </p>

      {images.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {images.slice(0, 3).map((img, i) => (
            <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
              <img src={img.secure_url || img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
          {images.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-medium">
              +{images.length - 3}
            </div>
          )}
        </div>
      )}

      <div className="text-slate-500 text-xs pt-2 border-t border-slate-800">
        {formatDate(createdAt, 'PPP')}
      </div>
    </Link>
  );
};

export default JournalCard;
