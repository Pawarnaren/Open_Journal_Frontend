const SkeletonCard = () => (
  <div className="glass-card p-5 space-y-4 animate-pulse">
    {/* Thumbnail */}
    <div className="skeleton rounded-xl h-48 w-full" />
    {/* Tag + date */}
    <div className="flex gap-2">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-24 rounded-full" />
    </div>
    {/* Title */}
    <div className="space-y-2">
      <div className="skeleton h-5 w-full rounded-lg" />
      <div className="skeleton h-5 w-3/4 rounded-lg" />
    </div>
    {/* Excerpt */}
    <div className="space-y-2">
      <div className="skeleton h-3.5 w-full rounded" />
      <div className="skeleton h-3.5 w-5/6 rounded" />
      <div className="skeleton h-3.5 w-2/3 rounded" />
    </div>
    {/* Footer */}
    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
      <div className="flex items-center gap-2">
        <div className="skeleton h-7 w-7 rounded-full" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
      <div className="skeleton h-4 w-16 rounded" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
