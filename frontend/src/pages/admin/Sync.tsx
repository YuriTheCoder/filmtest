import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import AdminNav from '@/components/admin/AdminNav';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/Button';
import { RefreshCw, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminSync() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: syncLogs, isLoading } = useQuery({
    queryKey: ['admin-sync-logs', page],
    queryFn: () => adminService.getSyncLogs(page, 20),
  });

  const manualSyncMutation = useMutation({
    mutationFn: adminService.triggerManualSync,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-sync-logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success(data.message || 'TMDB sync started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start TMDB sync');
    },
  });

  const handleManualSync = () => {
    if (window.confirm('Are you sure you want to trigger a manual TMDB sync? This may take several minutes.')) {
      manualSyncMutation.mutate();
    }
  };

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

  const logs = syncLogs?.data || [];
  const pagination = syncLogs?.pagination;

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-accent-primary" />
          <h1 className="text-4xl font-display font-bold">TMDB Sync Management</h1>
        </div>
        <Button
          onClick={handleManualSync}
          isLoading={manualSyncMutation.isPending}
          className="gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Trigger Manual Sync
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">About TMDB Sync</h3>
            <p className="text-sm text-text-secondary">
              The system automatically syncs with TMDB daily at midnight. You can also trigger a manual sync using
              the button above. Each sync fetches the latest popular, trending, and newly released movies from TMDB
              and updates the database accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Sync Logs Table */}
      <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Movies Added</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Movies Updated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'SUCCESS' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span
                        className={`font-semibold ${
                          log.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      {formatDate(log.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-500">{log.moviesAdded}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-blue-500">{log.moviesUpdated}</span>
                  </td>
                  <td className="px-6 py-4">
                    {log.errorMessage ? (
                      <p className="text-sm text-red-500 max-w-md truncate" title={log.errorMessage}>
                        {log.errorMessage}
                      </p>
                    ) : (
                      <span className="text-text-muted text-sm">No errors</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {logs.length === 0 && (
          <div className="p-12 text-center text-text-muted">
            <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No sync logs found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-text-muted text-sm">
              Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} total logs
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
