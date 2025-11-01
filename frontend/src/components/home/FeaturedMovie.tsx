import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface FeaturedMovieProps {
  movie: Movie;
}

export default function FeaturedMovie({ movie }: FeaturedMovieProps) {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdropUrl)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-black mb-6"
          >
            {movie.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-text-secondary mb-8 line-clamp-3"
          >
            {movie.synopsis}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <Link to={`/movies/${movie.slug}`}>
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                View Details
              </Button>
            </Link>
            <Link to={`/movies/${movie.slug}`}>
              <Button size="lg" variant="outline" className="gap-2">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
