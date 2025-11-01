import { useQuery } from '@tanstack/react-query';
import { moviesService } from '@/services/movies.service';
import { useAuthStore } from '@/store/authStore';
import { useToggleFavorite, useToggleWatchlist } from '@/hooks/useMovies';
import MovieCard from '@/components/movie/MovieCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function Watchlist() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: moviesService.getWatchlist,
    enabled: isAuthenticated,
  });

  const toggleFavorite = useToggleFavorite();
  const toggleWatchlist = useToggleWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Plus className="w-16 h-16 mx-auto mb-4 text-accent-primary" />
          <h1 className="text-3xl font-display font-bold mb-4">
            Sign In to View Watchlist
          </h1>
          <p className="text-text-secondary mb-6">
            Create an account or sign in to build your personal watchlist and track movies you want to watch.
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

  const movies = watchlist?.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Plus className="w-8 h-8 text-accent-primary" />
          <h1 className="text-4xl font-display font-bold">My Watchlist</h1>
        </div>
        <p className="text-text-secondary">
          {movies.length > 0
            ? `${movies.length} movie${movies.length !== 1 ? 's' : ''} in your watchlist`
            : 'No movies in watchlist'}
        </p>
      </div>

      {/* Empty State */}
      {movies.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="bg-bg-card border border-white/10 rounded-lg p-12">
            <Plus className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h2 className="text-2xl font-display font-bold mb-2">
              Your Watchlist is Empty
            </h2>
            <p className="text-text-secondary mb-6">
              Add movies you want to watch by clicking the plus icon on any movie card.
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
