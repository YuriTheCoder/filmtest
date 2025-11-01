export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Movie {
  id: string;
  tmdbId?: number;
  title: string;
  slug: string;
  synopsis: string;
  year: number;
  runtime: number;
  country: string;
  originalLanguage: string;
  directors: string[];
  cast: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  parentalRating: string | null;
  popularity: number;
  avgRating: number;
  ratingsCount: number;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
}

export interface MovieDetail extends Movie {
  reviews: Review[];
  similarMovies: Movie[];
  isFavorite: boolean;
  isInWatchlist: boolean;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  movie?: {
    title: string;
    slug: string;
  };
}

export interface MoviesResponse {
  data: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryMoviesParams {
  q?: string;
  genres?: string[];
  yearMin?: number;
  yearMax?: number;
  minRating?: number;
  maxRuntime?: number;
  country?: string;
  language?: string;
  sort?: 'popularity' | 'rating' | 'recent' | 'title' | 'year';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
