import { useQuery } from '@tanstack/react-query';
import { moviesService } from '@/services/movies.service';
import { reviewsService } from '@/services/reviews.service';
import { useAuthStore } from '@/store/authStore';
import { Heart, Plus, Star, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatDate } from '@/lib/utils';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: favorites, isLoading: loadingFavorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: moviesService.getFavorites,
    enabled: isAuthenticated,
  });

  const { data: watchlist, isLoading: loadingWatchlist } = useQuery({
    queryKey: ['watchlist'],
    queryFn: moviesService.getWatchlist,
    enabled: isAuthenticated,
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: reviewsService.getMyReviews,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-accent-primary" />
          <h1 className="text-3xl font-display font-bold mb-4">
            Sign In to View Profile
          </h1>
          <p className="text-text-secondary mb-6">
            Create an account or sign in to access your profile and activity.
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

  const isLoading = loadingFavorites || loadingWatchlist || loadingReviews;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const favoritesCount = favorites?.data?.length || 0;
  const watchlistCount = watchlist?.data?.length || 0;
  const reviewsCount = reviews?.data?.length || 0;

  const stats = [
    {
      label: 'Favorites',
      value: favoritesCount,
      icon: Heart,
      link: '/favorites',
      color: 'text-red-500',
    },
    {
      label: 'Watchlist',
      value: watchlistCount,
      icon: Plus,
      link: '/watchlist',
      color: 'text-blue-500',
    },
    {
      label: 'Reviews',
      value: reviewsCount,
      icon: Star,
      link: '#reviews',
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-accent-primary/20 to-accent-primary/5 border border-accent-primary/20 rounded-lg p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-accent-primary rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold mb-1">{user.name}</h1>
            <p className="text-text-secondary">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-block mt-2 px-3 py-1 bg-accent-primary/20 border border-accent-primary/40 rounded-full text-sm font-semibold">
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.link}>
              <div className="bg-bg-card border border-white/10 rounded-lg p-6 hover:border-accent-primary/50 transition group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-muted text-sm">{stat.label}</span>
                  <Icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition`} />
                </div>
                <p className="text-4xl font-display font-bold">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Reviews */}
      {reviewsCount > 0 && (
        <section id="reviews">
          <h2 className="text-2xl font-display font-bold mb-6">Recent Reviews</h2>
          <div className="space-y-4">
            {reviews?.data?.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="bg-bg-card border border-white/10 rounded-lg p-6 hover:border-accent-primary/30 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      to={`/movies/${review.movie.slug}`}
                      className="text-lg font-semibold hover:text-accent-primary transition"
                    >
                      {review.movie.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{review.rating}/10</span>
                      </div>
                      <span className="text-text-muted text-sm">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State for Reviews */}
      {reviewsCount === 0 && (
        <div className="text-center py-12">
          <div className="bg-bg-card border border-white/10 rounded-lg p-12 max-w-md mx-auto">
            <Star className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h3 className="text-xl font-display font-bold mb-2">
              No Reviews Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Start reviewing movies to share your thoughts with the community.
            </p>
            <Link to="/movies">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
