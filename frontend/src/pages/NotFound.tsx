import { Link } from 'react-router-dom';
import { Home, Search, Film } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 200,
          }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-9xl md:text-[12rem] font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-primary/50">
              404
            </h1>
            <Film className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 text-accent-primary/20 animate-pulse" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back to watching movies!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="w-5 h-5" />
                Go Home
              </Button>
            </Link>
            <Link to="/movies">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Search className="w-5 h-5" />
                Browse Movies
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-20"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gradient-to-br from-accent-primary/20 to-transparent rounded-lg"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
