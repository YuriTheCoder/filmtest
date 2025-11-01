import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/movie/MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
  onFavorite?: (movieId: string) => void;
  onWatchlist?: (movieId: string) => void;
}

export default function MovieRow({
  title,
  movies,
  viewAllLink,
  onFavorite,
  onWatchlist,
}: MovieRowProps) {
  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-1 text-accent-primary hover:underline"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.slice(0, 10).map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onFavorite={onFavorite}
            onWatchlist={onWatchlist}
          />
        ))}
      </div>
    </section>
  );
}
