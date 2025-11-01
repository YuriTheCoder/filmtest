import api from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Review } from '@/types/movie';

interface CreateReviewDto {
  movieId: string;
  rating: number;
  comment: string;
}

export const reviewsService = {
  async getMyReviews(): Promise<ApiResponse<Review[]>> {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  async createReview(data: CreateReviewDto): Promise<ApiResponse<Review>> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async updateReview(
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): Promise<ApiResponse<Review>> {
    const response = await api.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },

  async deleteReview(reviewId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};
