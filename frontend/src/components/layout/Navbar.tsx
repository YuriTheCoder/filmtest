import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://i.ibb.co/pr0fjg6p/e9884007598e2e329d53bb448ede4084-removebg-preview.png"
              alt="Logo"
              className="h-8"
            />
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/movies" className="hover:text-accent-primary transition">
              Movies
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/favorites" className="hover:text-accent-primary transition">
                  Favorites
                </Link>
                <Link to="/watchlist" className="hover:text-accent-primary transition">
                  Watchlist
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 hover:text-accent-primary transition"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-2 hover:text-accent-primary transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary/90 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-4 py-2 hover:text-accent-primary transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden md:block px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary/90 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-bg-card transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-2 animate-fadeInUp">
            <Link
              to="/movies"
              onClick={closeMobileMenu}
              className="block px-4 py-3 hover:bg-white/5 rounded-lg transition"
            >
              Movies
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 hover:bg-white/5 rounded-lg transition"
                >
                  Favorites
                </Link>
                <Link
                  to="/watchlist"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 hover:bg-white/5 rounded-lg transition"
                >
                  Watchlist
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 hover:bg-white/5 rounded-lg transition"
                >
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-white/5 rounded-lg transition"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition text-accent-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 hover:bg-white/5 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 bg-accent-primary hover:bg-accent-primary/90 rounded-lg transition text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
