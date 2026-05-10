import { FileQuestion, BookOpen, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const icons = {
  blogs: BookOpen,
  journals: Pencil,
  default: FileQuestion,
};

const EmptyState = ({
  type = 'default',
  title = 'Nothing here yet',
  description = '',
  actionLabel = '',
  actionTo = '',
  onAction,
}) => {
  const Icon = icons[type] ?? icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-primary-950 border border-primary-800/40 flex items-center justify-center mb-6 shadow-lg shadow-primary-950/50">
        <Icon size={36} className="text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
