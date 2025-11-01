import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import AdminNav from '@/components/admin/AdminNav';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/Button';
import { Users as UsersIcon, Shield, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminService.getUsers(page, 20),
  });

  const updateRoleMutation = useMutation({
    mutationFn: adminService.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user role');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete user');
    },
  });

  const handleToggleRole = (userId: string, currentRole: 'USER' | 'ADMIN') => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      deleteUserMutation.mutate(userId);
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

  const userList = users?.data || [];
  const pagination = users?.pagination;

  return (
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <UsersIcon className="w-8 h-8 text-accent-primary" />
        <h1 className="text-4xl font-display font-bold">User Management</h1>
      </div>

      {/* Users Table */}
      <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {userList.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-text-secondary text-sm">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-accent-primary/20 text-accent-primary'
                          : 'bg-white/10 text-text-secondary'
                      }`}
                    >
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-text-muted text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRole(user.id, user.role)}
                        isLoading={updateRoleMutation.isPending}
                      >
                        {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        isLoading={deleteUserMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-text-muted text-sm">
              Page {pagination.currentPage} of {pagination.totalPages} · {pagination.total} total users
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
