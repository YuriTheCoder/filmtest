import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { moviesService } from '@/services/movies.service';
import { QueryMoviesParams } from '@/types/movie';

export function useMovies(params?: QueryMoviesParams) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => moviesService.getAll(params),
  });
}

export function useMovie(slug: string) {
  return useQuery({
    queryKey: ['movie', slug],
    queryFn: () => moviesService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moviesService.toggleFavorite,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Failed to update favorites');
    },
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moviesService.toggleWatchlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie'] });
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Failed to update watchlist');
    },
  });
}
