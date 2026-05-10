import { Link } from 'react-router-dom';
import { Heart, Clock, Calendar, Tag } from 'lucide-react';
import { cloudinaryUrl } from '../services/uploadService';
import { formatDate, readTime } from '../utils/formatDate';
import { truncateText, stripHtml } from '../utils/truncateText';

const BlogCard = ({ blog }) => {
  const {
    id,
    title = '',
    content = '',
    excerpt,
    tags = [],
    author,
    likeCount = 0,
    coverImagePublicId,
    coverImageUrl,
    createdAt,
  } = blog;

  const thumbnail =
    coverImagePublicId
      ? cloudinaryUrl(coverImagePublicId, 'q_auto,f_auto,w_400,h_220,c_fill')
      : coverImageUrl || null;

  const displayExcerpt = excerpt || truncateText(stripHtml(content), 130);
  const readTimeStr = readTime(stripHtml(content));

  return (
    <Link
      to={`/blog/${id}`}
      className="group card flex flex-col gap-4 no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-2xl"
      id={`blog-card-${id}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-xl bg-slate-800 aspect-video">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-950 to-slate-900">
            <span className="text-4xl opacity-30">📖</span>
          </div>
        )}
        {/* Read time badge */}
        <span className="absolute top-3 right-3 badge bg-slate-950/70 text-slate-300 backdrop-blur-sm">
          <Clock size={11} />
          {readTimeStr}
        </span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="badge bg-primary-950/60 text-primary-300 border border-primary-800/40"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className="text-slate-100 font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary-300 transition-colors">
        {title}
      </h2>

      {/* Excerpt */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">
        {displayExcerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-2">
          {/* Author avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {author?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="text-slate-300 text-xs font-medium truncate max-w-[100px]">
            {author?.name || 'Unknown'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 text-xs">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={11} />
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
