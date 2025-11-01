import { useQuery } from '@tanstack/react-query';
import { moviesService } from '@/services/movies.service';
import { useAuthStore } from '@/store/authStore';
import { useToggleFavorite, useToggleWatchlist } from '@/hooks/useMovies';
import MovieCard from '@/components/movie/MovieCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function Favorites() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: moviesService.getFavorites,
    enabled: isAuthenticated,
  });

  const toggleFavorite = useToggleFavorite();
  const toggleWatchlist = useToggleWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-accent-primary" />
          <h1 className="text-3xl font-display font-bold mb-4">
            Sign In to View Favorites
          </h1>
          <p className="text-text-secondary mb-6">
            Create an account or sign in to save your favorite movies and access them anytime.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Sign Up Free</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const movies = favorites?.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-accent-primary fill-accent-primary" />
          <h1 className="text-4xl font-display font-bold">My Favorites</h1>
        </div>
        <p className="text-text-secondary">
          {movies.length > 0
            ? `${movies.length} movie${movies.length !== 1 ? 's' : ''} in your favorites`
            : 'No favorites yet'}
        </p>
      </div>

      {/* Empty State */}
      {movies.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="bg-bg-card border border-white/10 rounded-lg p-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h2 className="text-2xl font-display font-bold mb-2">
              No Favorites Yet
            </h2>
            <p className="text-text-secondary mb-6">
              Start adding movies to your favorites by clicking the heart icon on any movie card.
            </p>
            <Link to="/movies">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Movies Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onFavorite={toggleFavorite.mutate}
              onWatchlist={toggleWatchlist.mutate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
