export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime?: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  original_language: string;
  genre_ids?: number[];
  genres?: TmdbGenre[];
}

export interface TmdbMovieDetails extends TmdbMovie {
  runtime: number;
  genres: TmdbGenre[];
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  credits?: {
    cast: Array<{
      name: string;
      character: string;
      order: number;
    }>;
    crew: Array<{
      name: string;
      job: string;
      department: string;
    }>;
  };
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
    }>;
  };
  release_dates?: {
    results: Array<{
      iso_3166_1: string;
      release_dates: Array<{
        certification: string;
        type: number;
      }>;
    }>;
  };
}

export interface TmdbMoviesResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}
