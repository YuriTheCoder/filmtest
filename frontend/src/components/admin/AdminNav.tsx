import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, RefreshCw } from 'lucide-react';

const adminNavItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users,
  },
  {
    label: 'TMDB Sync',
    path: '/admin/sync',
    icon: RefreshCw,
  },
];

export default function AdminNav() {
  const location = useLocation();

  return (
    <div className="border-b border-white/10 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                  isActive
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
