import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import AdminNav from '@/components/admin/AdminNav';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Film, Users, Star, Heart, Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  });

  if (isLoading) {
    return (
      <>
        <AdminNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  const kpis = [
    {
      label: 'Total Movies',
      value: stats?.data.totalMovies || 0,
      icon: Film,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Users',
      value: stats?.data.totalUsers || 0,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Reviews',
      value: stats?.data.totalReviews || 0,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Favorites',
      value: stats?.data.totalFavorites || 0,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Watchlist Items',
      value: stats?.data.totalWatchlistItems || 0,
      icon: Plus,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-bg-card border border-white/10 rounded-lg p-6 hover:border-accent-primary/50 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-3xl font-display font-bold mb-1">{kpi.value.toLocaleString()}</p>
              <p className="text-text-muted text-sm">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Sync Activity */}
      <section>
        <h2 className="text-2xl font-display font-bold mb-6">Recent TMDB Syncs</h2>
        <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden">
          {stats?.data.recentSyncs && stats.data.recentSyncs.length > 0 ? (
            <div className="divide-y divide-white/10">
              {stats.data.recentSyncs.map((sync) => (
                <div key={sync.id} className="p-6 hover:bg-white/5 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {sync.status === 'SUCCESS' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {sync.status === 'SUCCESS' ? 'Sync Completed' : 'Sync Failed'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(sync.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-muted">
                        {sync.moviesAdded} added · {sync.moviesUpdated} updated
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-text-muted">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent sync activity</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
}
