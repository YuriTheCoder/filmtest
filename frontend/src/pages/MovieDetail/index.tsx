import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovie, useToggleFavorite, useToggleWatchlist } from '@/hooks/useMovies';
import { useAuthStore } from '@/store/authStore';
import { Star, Heart, Plus, Clock, Calendar, Film as FilmIcon } from 'lucide-react';
import { formatRuntime, formatRating, getImageUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';
import MovieCard from '@/components/movie/MovieCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import GenreChip from '@/components/movie/GenreChip';

export default function MovieDetail() {
  const { slug } = useParams<{ slug: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: movie, isLoading } = useMovie(slug!);
  const toggleFavorite = useToggleFavorite();
  const toggleWatchlist = useToggleWatchlist();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <Link to="/movies">
          <Button>Browse Movies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh]">
        {movie.backdropUrl && (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(movie.backdropUrl)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-transparent" />
          </div>
        )}

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block w-64 flex-shrink-0"
            >
              <img
                src={getImageUrl(movie.posterUrl)}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl border border-white/10"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                {movie.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-text-secondary mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{formatRating(movie.avgRating)}</span>
                  <span className="text-text-muted">({movie.ratingsCount} reviews)</span>
                </div>
                {movie.parentalRating && (
                  <div className="px-2 py-0.5 border border-white/20 rounded text-sm">
                    {movie.parentalRating}
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <GenreChip key={genre.id} genre={genre} />
                ))}
              </div>

              {/* Actions */}
              {isAuthenticated && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => toggleFavorite.mutate(movie.id)}
                    variant={movie.isFavorite ? 'primary' : 'outline'}
                    className="gap-2"
                  >
                    <Heart className={movie.isFavorite ? 'fill-current' : ''} />
                    {movie.isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  <Button
                    onClick={() => toggleWatchlist.mutate(movie.id)}
                    variant={movie.isInWatchlist ? 'primary' : 'outline'}
                    className="gap-2"
                  >
                    <Plus className={movie.isInWatchlist ? 'fill-current' : ''} />
                    {movie.isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">Synopsis</h2>
              <p className="text-text-secondary leading-relaxed">{movie.synopsis}</p>
            </section>

            {/* Cast & Crew */}
            {(movie.directors.length > 0 || movie.cast.length > 0) && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-4">Cast & Crew</h2>
                <div className="space-y-4">
                  {movie.directors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-text-muted mb-2">
                        Director{movie.directors.length > 1 ? 's' : ''}
                      </h3>
                      <p className="text-text-secondary">{movie.directors.join(', ')}</p>
                    </div>
                  )}
                  {movie.cast.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-text-muted mb-2">Cast</h3>
                      <p className="text-text-secondary">{movie.cast.slice(0, 10).join(', ')}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Similar Movies */}
            {movie.similarMovies.length > 0 && (
              <section>
                <h2 className="text-2xl font-display font-bold mb-4">Similar Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.similarMovies.map((similar) => (
                    <MovieCard key={similar.id} movie={similar} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-bg-card border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-text-muted">Country</dt>
                  <dd>{movie.country}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Language</dt>
                  <dd>{movie.originalLanguage.toUpperCase()}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Popularity</dt>
                  <dd>{movie.popularity.toFixed(1)}</dd>
                </div>
              </dl>
            </div>

            {/* Trailer */}
            {movie.trailerUrl && (
              <div className="bg-bg-card border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Trailer</h3>
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <FilmIcon className="w-5 h-5" />
                    Watch Trailer
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
