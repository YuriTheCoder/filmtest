export default function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-bg-card border border-white/10 animate-pulse">
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] bg-bg-secondary shimmer" />

      {/* Info Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-bg-secondary rounded shimmer w-3/4" />

        {/* Year & Runtime */}
        <div className="flex gap-4">
          <div className="h-4 bg-bg-secondary rounded shimmer w-16" />
          <div className="h-4 bg-bg-secondary rounded shimmer w-16" />
        </div>

        {/* Genres */}
        <div className="flex gap-2">
          <div className="h-6 bg-bg-secondary rounded-full shimmer w-20" />
          <div className="h-6 bg-bg-secondary rounded-full shimmer w-20" />
        </div>
      </div>
    </div>
  );
}
