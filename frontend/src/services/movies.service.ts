import api from '@/lib/api';
import {
  Movie,
  MovieDetail,
  MoviesResponse,
  QueryMoviesParams,
} from '@/types/movie';

export const moviesService = {
  getAll: async (params?: QueryMoviesParams): Promise<MoviesResponse> => {
    const { data } = await api.get('/movies', { params });
    return data;
  },

  getBySlug: async (slug: string): Promise<MovieDetail> => {
    const { data } = await api.get(`/movies/${slug}`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/movies/stats');
    return data;
  },

  toggleFavorite: async (movieId: string) => {
    const { data } = await api.post(`/movies/${movieId}/favorite`);
    return data;
  },

  toggleWatchlist: async (movieId: string) => {
    const { data } = await api.post(`/movies/${movieId}/watchlist`);
    return data;
  },

  getFavorites: async (page = 1, limit = 20): Promise<MoviesResponse> => {
    const { data } = await api.get('/me/favorites', {
      params: { page, limit },
    });
    return data;
  },

  getWatchlist: async (page = 1, limit = 20): Promise<MoviesResponse> => {
    const { data } = await api.get('/me/watchlist', {
      params: { page, limit },
    });
    return data;
  },
};
