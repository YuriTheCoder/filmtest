export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="https://i.ibb.co/ksvHyBDK/png-transparent-logo-netflix-nasdaq-nflx-brand-television-copywriter-floor-television-text-rectangle.png"
                alt="Logo"
                className="h-12"
              />
            </div>
            <p className="text-text-secondary text-sm">
              Your premium movie catalog with real-time TMDB integration.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/movies" className="hover:text-accent-primary transition">Browse Movies</a></li>
              <li><a href="/movies?sort=popularity" className="hover:text-accent-primary transition">Popular</a></li>
              <li><a href="/movies?sort=recent" className="hover:text-accent-primary transition">Recent</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/profile" className="hover:text-accent-primary transition">Profile</a></li>
              <li><a href="/favorites" className="hover:text-accent-primary transition">Favorites</a></li>
              <li><a href="/watchlist" className="hover:text-accent-primary transition">Watchlist</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="https://www.themoviedb.org" target="_blank" rel="noopener" className="hover:text-accent-primary transition">TMDB API</a></li>
              <li><a href="https://github.com" className="hover:text-accent-primary transition">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Built with NestJS & React.</p>
        </div>
      </div>
    </footer>
  );
}
