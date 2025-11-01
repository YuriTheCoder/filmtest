import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Heart, List, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function MobileBottomNav() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      requiresAuth: false,
    },
    {
      label: 'Movies',
      path: '/movies',
      icon: Film,
      requiresAuth: false,
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: Heart,
      requiresAuth: true,
    },
    {
      label: 'Watchlist',
      path: '/watchlist',
      icon: List,
      requiresAuth: true,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      requiresAuth: true,
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-primary/95 backdrop-blur-md border-t border-white/10 safe-area-bottom">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all active:scale-95 ${
                isActive
                  ? 'text-accent-primary bg-accent-primary/10'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-accent-primary/20' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
