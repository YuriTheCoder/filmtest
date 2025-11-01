import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Heart, Plus, Info, Star } from 'lucide-react';
import { Movie } from '@/types/movie';
import { formatRating, getImageUrl } from '@/lib/utils';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface MovieCardProps {
  movie: Movie;
  onFavorite?: (movieId: string) => void;
  onWatchlist?: (movieId: string) => void;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
}

export default function MovieCard({
  movie,
  onFavorite,
  onWatchlist,
  isFavorite = false,
  isInWatchlist = false,
}: MovieCardProps) {
  const navigate = useNavigate();
  // Check if movie was added in the last 30 days AND is from a recent year
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const currentYear = new Date().getFullYear();
  const isNew = new Date(movie.createdAt) > thirtyDaysAgo && movie.year >= currentYear - 1;
  const isHighRated = movie.avgRating >= 8;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-lg overflow-hidden bg-bg-card border border-white/10 hover:border-accent-primary/50 transition-all touch-manipulation"
    >
      {/* Poster */}
      <Link to={`/movies/${movie.slug}`} className="block relative aspect-[2/3]">
        <LazyLoadImage
          src={getImageUrl(movie.posterUrl)}
          alt={movie.title}
          effect="blur"
          className="w-full h-full object-cover"
          placeholderSrc="/placeholder-movie.jpg"
        />

        {/* Overlay - Appears on hover (desktop) or tap (mobile) */}
        <div className="absolute inset-0 bg-black/80 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 active:opacity-100">
          {onFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavorite(movie.id);
              }}
              className={cn(
                'p-3 rounded-full transition-all',
                isFavorite
                  ? 'bg-accent-primary text-white'
                  : 'bg-white/10 hover:bg-white/20'
              )}
              aria-label="Toggle favorite"
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
          )}
          {onWatchlist && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onWatchlist(movie.id);
              }}
              className={cn(
                'p-3 rounded-full transition-all',
                isInWatchlist
                  ? 'bg-accent-primary text-white'
                  : 'bg-white/10 hover:bg-white/20'
              )}
              aria-label="Toggle watchlist"
            >
              <Plus className={cn('w-5 h-5', isInWatchlist && 'fill-current')} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/movies/${movie.slug}`);
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="View details"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-semibold">{formatRating(movie.avgRating)}</span>
        </div>

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-accent-primary px-2 py-1 rounded text-xs font-bold">
            NEW
          </div>
        )}

        {/* High Rated Badge */}
        {isHighRated && (
          <div className="absolute top-10 left-2 bg-green-600 px-2 py-1 rounded text-xs font-bold">
            ⭐ TOP
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/movies/${movie.slug}`}>
          <h3 className="font-semibold text-lg mb-1 truncate hover:text-accent-primary transition">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
          <span>{movie.year}</span>
          <span>{movie.runtime}min</span>
        </div>

        {/* Genres */}
        <div className="flex gap-1 flex-wrap">
          {movie.genres.slice(0, 2).map((genre) => (
            <span
              key={genre.id}
              className="px-2 py-0.5 text-xs rounded-full bg-bg-secondary border border-white/10"
            >
              {genre.name}
            </span>
          ))}
          {movie.genres.length > 2 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-bg-secondary border border-white/10">
              +{movie.genres.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Helper function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
