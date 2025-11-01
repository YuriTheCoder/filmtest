import api from '@/lib/api';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { User } from '@/types/user';

interface AdminStats {
  totalMovies: number;
  totalUsers: number;
  totalReviews: number;
  totalFavorites: number;
  totalWatchlistItems: number;
  recentSyncs: {
    id: string;
    status: 'SUCCESS' | 'FAILED';
    moviesAdded: number;
    moviesUpdated: number;
    createdAt: string;
  }[];
}

interface SyncLog {
  id: string;
  status: 'SUCCESS' | 'FAILED';
  moviesAdded: number;
  moviesUpdated: number;
  errorMessage: string | null;
  createdAt: string;
}

interface UpdateUserRoleDto {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  async updateUserRole(data: UpdateUserRoleDto): Promise<ApiResponse<User>> {
    const response = await api.patch(`/admin/users/${data.userId}/role`, {
      role: data.role,
    });
    return response.data;
  },

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  async getSyncLogs(page = 1, limit = 20): Promise<PaginatedResponse<SyncLog>> {
    const response = await api.get('/admin/sync-logs', {
      params: { page, limit },
    });
    return response.data;
  },

  async triggerManualSync(): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post('/admin/tmdb/sync');
    return response.data;
  },
};
