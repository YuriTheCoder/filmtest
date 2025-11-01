import { useState } from 'react';
import { useMovies, useToggleFavorite, useToggleWatchlist } from '@/hooks/useMovies';
import { useAuthStore } from '@/store/authStore';
import { QueryMoviesParams } from '@/types/movie';
import MovieCard from '@/components/movie/MovieCard';
import MovieCardSkeleton from '@/components/movie/MovieCardSkeleton';
import SearchInput from '@/components/ui/SearchInput';
import Select from '@/components/ui/Select';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { Film } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Movies() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [params, setParams] = useState<QueryMoviesParams>({
    page: 1,
    limit: 20,
    sort: 'popularity',
    order: 'desc',
  });

  const { data, isLoading } = useMovies(params);
  const toggleFavorite = useToggleFavorite();
  const toggleWatchlist = useToggleWatchlist();

  const handleSearch = (q: string) => {
    setParams((prev) => ({ ...prev, q, page: 1 }));
  };

  const handleSort = (sort: string) => {
    setParams((prev) => ({ ...prev, sort: sort as any, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Explore Movies</h1>
        <p className="text-text-secondary">
          Discover from our collection of {data?.pagination.total || 0} movies
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchInput
            placeholder="Search movies..."
            onSearch={handleSearch}
            defaultValue={params.q}
          />
        </div>
        <Select
          value={params.sort}
          onChange={(e) => handleSort(e.target.value)}
          options={[
            { value: 'popularity', label: 'Most Popular' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'recent', label: 'Recently Added' },
            { value: 'title', label: 'Title (A-Z)' },
            { value: 'year', label: 'Release Year' },
          ]}
          className="md:w-48"
        />
      </div>

      {/* Movies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState
          icon={<Film className="w-16 h-16" />}
          title="No movies found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data?.data.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavorite={isAuthenticated ? toggleFavorite.mutate : undefined}
                onWatchlist={isAuthenticated ? toggleWatchlist.mutate : undefined}
              />
            ))}
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <Button
                onClick={() => handlePageChange(params.page! - 1)}
                disabled={params.page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-text-secondary px-4">
                Page {params.page} of {data.pagination.totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(params.page! + 1)}
                disabled={params.page === data.pagination.totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
