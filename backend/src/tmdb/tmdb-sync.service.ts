import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from './tmdb.service';
import slugify from 'slugify';

@Injectable()
export class TmdbSyncService {
  private readonly logger = new Logger(TmdbSyncService.name);
  private isSyncing = false;

  constructor(
    private prisma: PrismaService,
    private tmdb: TmdbService,
  ) {}

  /**
   * Daily sync at 4:00 AM UTC
   */
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async handleDailySync() {
    if (this.isSyncing) {
      this.logger.warn('Sync already in progress, skipping...');
      return;
    }

    this.logger.log('Starting daily TMDB sync...');
    await this.syncMovies();
  }

  /**
   * Manual sync method (can be called from admin panel)
   */
  async syncMovies(): Promise<{
    imported: number;
    updated: number;
    failed: number;
  }> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }

    this.isSyncing = true;
    const stats = {
      imported: 0,
      updated: 0,
      failed: 0,
    };

    try {
      this.logger.log('Syncing genres...');
      await this.syncGenres();

      this.logger.log('Fetching popular movies...');
      const popular = await this.tmdb.getPopular(1);
      const movieIds = popular.results.map((m) => m.id);

      this.logger.log('Fetching trending movies...');
      const trending = await this.tmdb.getTrending('week');
      movieIds.push(...trending.results.map((m) => m.id));

      // Remove duplicates
      const uniqueIds = Array.from(new Set(movieIds));
      this.logger.log(`Processing ${uniqueIds.length} movies...`);

      for (const movieId of uniqueIds) {
        try {
          const existing = await this.prisma.movie.findUnique({
            where: { tmdbId: movieId },
          });

          const details = await this.tmdb.getMovieDetails(movieId);

          if (!details.title || !details.release_date || !details.runtime) {
            continue;
          }

          const year = parseInt(details.release_date.split('-')[0]);
          const slug = slugify(`${details.title}-${year}`, {
            lower: true,
            strict: true,
          });

          const movieData = {
            tmdbId: details.id,
            title: details.title,
            slug,
            synopsis: details.overview || 'No synopsis available.',
            year,
            runtime: details.runtime,
            country: details.production_countries?.[0]?.iso_3166_1 || 'US',
            originalLanguage: details.original_language,
            directors: this.tmdb.getDirectors(details.credits),
            cast: this.tmdb.getCast(details.credits),
            posterUrl: this.tmdb.getPosterUrl(details.poster_path),
            backdropUrl: this.tmdb.getBackdropUrl(details.backdrop_path),
            trailerUrl: this.tmdb.getTrailerUrl(details.videos),
            parentalRating: this.tmdb.getParentalRating(details.release_dates),
            popularity: details.popularity,
            avgRating: details.vote_average,
            ratingsCount: details.vote_count,
          };

          if (existing) {
            // Update existing movie
            await this.prisma.movie.update({
              where: { id: existing.id },
              data: movieData,
            });
            stats.updated++;
          } else {
            // Create new movie
            const movie = await this.prisma.movie.create({
              data: movieData,
            });

            // Connect genres
            if (details.genres && details.genres.length > 0) {
              const genreIds = details.genres.map((g) => g.id);
              const genres = await this.prisma.genre.findMany({
                where: { tmdbId: { in: genreIds } },
              });

              await this.prisma.movie.update({
                where: { id: movie.id },
                data: {
                  genres: {
                    connect: genres.map((g) => ({ id: g.id })),
                  },
                },
              });
            }

            stats.imported++;
          }

          if ((stats.imported + stats.updated) % 10 === 0) {
            this.logger.log(
              `Progress: ${stats.imported} imported, ${stats.updated} updated`,
            );
          }
        } catch (error) {
          this.logger.error(`Failed to sync movie ${movieId}: ${error.message}`);
          stats.failed++;
        }
      }

      this.logger.log(
        `Sync complete: ${stats.imported} imported, ${stats.updated} updated, ${stats.failed} failed`,
      );

      // Log success
      await this.prisma.syncLog.create({
        data: {
          type: 'TMDB_SYNC',
          status: 'SUCCESS',
          message: 'Daily sync completed',
          stats,
        },
      });

      return stats;
    } catch (error) {
      this.logger.error(`Sync failed: ${error.message}`);

      // Log failure
      await this.prisma.syncLog.create({
        data: {
          type: 'TMDB_SYNC',
          status: 'FAILURE',
          message: error.message,
        },
      });

      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncGenres() {
    const tmdbGenres = await this.tmdb.getGenres();

    for (const tmdbGenre of tmdbGenres) {
      const slug = slugify(tmdbGenre.name, { lower: true, strict: true });

      await this.prisma.genre.upsert({
        where: { tmdbId: tmdbGenre.id },
        update: { name: tmdbGenre.name, slug },
        create: {
          tmdbId: tmdbGenre.id,
          name: tmdbGenre.name,
          slug,
        },
      });
    }
  }
}
