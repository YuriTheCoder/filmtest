import api from '@/lib/api';
import { AuthResponse, LoginData, RegisterData, ProfileResponse } from '@/types/user';

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: FormData): Promise<any> => {
    const response = await api.patch('/users/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
