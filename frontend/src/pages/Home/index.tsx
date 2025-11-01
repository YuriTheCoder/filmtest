import { useMovies, useToggleFavorite, useToggleWatchlist } from '@/hooks/useMovies';
import { useAuthStore } from '@/store/authStore';
import FeaturedMovie from '@/components/home/FeaturedMovie';
import MovieRow from '@/components/home/MovieRow';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch different movie collections
  const { data: popular } = useMovies({ sort: 'popularity', limit: 20 });
  const { data: highRated } = useMovies({ sort: 'rating', minRating: 7.5, limit: 20 });
  const { data: recent } = useMovies({ sort: 'recent', limit: 20 });

  const toggleFavorite = useToggleFavorite();
  const toggleWatchlist = useToggleWatchlist();

  // Use first popular movie as featured
  const featuredMovie = popular?.data[0];

  if (!featuredMovie) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Featured Movie Hero */}
      <FeaturedMovie movie={featuredMovie} />

      {/* Movie Rows */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Popular Movies */}
        {popular && popular.data.length > 0 && (
          <MovieRow
            title="Popular Now"
            movies={popular.data}
            viewAllLink="/movies?sort=popularity"
            onFavorite={isAuthenticated ? toggleFavorite.mutate : undefined}
            onWatchlist={isAuthenticated ? toggleWatchlist.mutate : undefined}
          />
        )}

        {/* High Rated */}
        {highRated && highRated.data.length > 0 && (
          <MovieRow
            title="Top Rated"
            movies={highRated.data}
            viewAllLink="/movies?sort=rating"
            onFavorite={isAuthenticated ? toggleFavorite.mutate : undefined}
            onWatchlist={isAuthenticated ? toggleWatchlist.mutate : undefined}
          />
        )}

        {/* Recently Added */}
        {recent && recent.data.length > 0 && (
          <MovieRow
            title="Recently Added"
            movies={recent.data}
            viewAllLink="/movies?sort=recent"
            onFavorite={isAuthenticated ? toggleFavorite.mutate : undefined}
            onWatchlist={isAuthenticated ? toggleWatchlist.mutate : undefined}
          />
        )}

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-accent-primary/10 to-accent-primary/5 border border-accent-primary/20 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Join Cinema App Today
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Create an account to save your favorite movies, build watchlists, and write reviews.
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
        )}

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-display font-bold text-center mb-8">
            Why Cinema App?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '100+ Movies',
                description: 'Extensive catalog synced daily from TMDB',
              },
              {
                title: 'Smart Search',
                description: 'Find movies by title, genre, year, and rating',
              },
              {
                title: 'Personal Collections',
                description: 'Save favorites and build watchlists',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-bg-card border border-white/10 rounded-lg p-6 hover:border-accent-primary/50 transition"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
