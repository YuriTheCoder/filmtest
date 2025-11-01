import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  TmdbMoviesResponse,
  TmdbMovieDetails,
  TmdbGenre,
} from './interfaces/tmdb-movie.interface';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly imageBaseUrl: string;
  private readonly requestDelay: number;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get('TMDB_API_KEY') || 'YOUR_TMDB_API_KEY_HERE';
    this.apiUrl = this.configService.get('TMDB_API_URL') || 'https://api.themoviedb.org/3';
    this.imageBaseUrl = this.configService.get(
      'TMDB_IMAGE_BASE_URL',
    ) || 'https://image.tmdb.org/t/p';
    this.requestDelay = parseInt(
      this.configService.get('TMDB_REQUEST_DELAY') || '300',
      10,
    );
  }

  /**
   * Fetch popular movies
   */
  async getPopular(page: number = 1): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>(`${this.apiUrl}/movie/popular`, {
          params: {
            api_key: this.apiKey,
            page,
            language: 'en-US',
          },
        }),
      );

      await this.delay();
      return response.data as TmdbMoviesResponse;
    } catch (error) {
      this.logger.error(`Failed to fetch popular movies: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch trending movies (week)
   */
  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>(`${this.apiUrl}/trending/movie/${timeWindow}`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
          },
        }),
      );

      await this.delay();
      return response.data as TmdbMoviesResponse;
    } catch (error) {
      this.logger.error(`Failed to fetch trending movies: ${error.message}`);
      throw error;
    }
  }

  /**
   * Discover movies with filters
   */
  async discoverMovies(options: {
    page?: number;
    sortBy?: string;
    withGenres?: string;
    primaryReleaseYear?: number;
    region?: string;
  } = {}): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>(`${this.apiUrl}/discover/movie`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            page: options.page || 1,
            sort_by: options.sortBy || 'popularity.desc',
            with_genres: options.withGenres,
            primary_release_year: options.primaryReleaseYear,
            region: options.region,
          },
        }),
      );

      await this.delay();
      return response.data as TmdbMoviesResponse;
    } catch (error) {
      this.logger.error(`Failed to discover movies: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get movie details by TMDB ID
   */
  async getMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMovieDetails>(`${this.apiUrl}/movie/${tmdbId}`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            append_to_response: 'credits,videos,release_dates',
          },
        }),
      );

      await this.delay();
      return response.data as TmdbMovieDetails;
    } catch (error) {
      this.logger.error(
        `Failed to fetch movie details for ID ${tmdbId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get all genres
   */
  async getGenres(): Promise<TmdbGenre[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ genres: TmdbGenre[] }>(`${this.apiUrl}/genre/movie/list`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
          },
        }),
      );

      await this.delay();
      return (response.data as { genres: TmdbGenre[] }).genres;
    } catch (error) {
      this.logger.error(`Failed to fetch genres: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search movies by query
   */
  async searchMovies(query: string, page: number = 1): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>(`${this.apiUrl}/search/movie`, {
          params: {
            api_key: this.apiKey,
            language: 'en-US',
            query,
            page,
          },
        }),
      );

      await this.delay();
      return response.data as TmdbMoviesResponse;
    } catch (error) {
      this.logger.error(`Failed to search movies: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get poster URL
   */
  getPosterUrl(path: string | null, size: string = 'w500'): string | null {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Get backdrop URL
   */
  getBackdropUrl(path: string | null, size: string = 'original'): string | null {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Get YouTube trailer URL
   */
  getTrailerUrl(videos: TmdbMovieDetails['videos']): string | null {
    if (!videos || !videos.results.length) return null;

    const trailer = videos.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer',
    );

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  /**
   * Extract directors from credits
   */
  getDirectors(credits: TmdbMovieDetails['credits']): string[] {
    if (!credits || !credits.crew) return [];

    return credits.crew
      .filter((member) => member.job === 'Director')
      .map((director) => director.name);
  }

  /**
   * Extract top cast (first 10)
   */
  getCast(credits: TmdbMovieDetails['credits']): string[] {
    if (!credits || !credits.cast) return [];

    return credits.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 10)
      .map((actor) => actor.name);
  }

  /**
   * Get parental rating (US certification)
   */
  getParentalRating(releaseDates: TmdbMovieDetails['release_dates']): string | null {
    if (!releaseDates || !releaseDates.results) return null;

    const usRelease = releaseDates.results.find((r) => r.iso_3166_1 === 'US');
    if (!usRelease || !usRelease.release_dates.length) return null;

    const theatrical = usRelease.release_dates.find((d) => d.type === 3); // Theatrical
    return theatrical?.certification || usRelease.release_dates[0]?.certification || null;
  }

  /**
   * Delay between requests to respect API rate limits
   */
  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.requestDelay));
  }
}
