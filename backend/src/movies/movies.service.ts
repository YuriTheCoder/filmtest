import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { QueryMoviesDto } from './dto/query-movies.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from '../tmdb/tmdb.service';

@Injectable()
export class MoviesService {
  constructor(
    private prisma: PrismaService,
    private tmdb: TmdbService,
  ) {}

  async findAll(query: QueryMoviesDto) {
    const {
      q,
      genres,
      yearMin,
      yearMax,
      minRating,
      maxRuntime,
      country,
      language,
      sort = 'popularity',
      order = 'desc',
      page = 1,
      limit = 20,
    } = query;

    // Build where clause
    const where: Prisma.MovieWhereInput = {};

    // Search by title or synopsis
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { synopsis: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filter by genres
    if (genres && genres.length > 0) {
      where.genres = {
        some: {
          id: { in: genres },
        },
      };
    }

    // Filter by year range
    if (yearMin || yearMax) {
      where.year = {};
      if (yearMin) where.year.gte = yearMin;
      if (yearMax) where.year.lte = yearMax;
    }

    // Filter by rating
    if (minRating) {
      where.avgRating = { gte: minRating };
    }

    // Filter by runtime
    if (maxRuntime) {
      where.runtime = { lte: maxRuntime };
    }

    // Filter by country
    if (country) {
      where.country = country;
    }

    // Filter by language
    if (language) {
      where.originalLanguage = language;
    }

    // Build orderBy
    const orderBy: Prisma.MovieOrderByWithRelationInput = {};
    switch (sort) {
      case 'popularity':
        orderBy.popularity = order;
        break;
      case 'rating':
        orderBy.avgRating = order;
        break;
      case 'recent':
        orderBy.createdAt = order;
        break;
      case 'title':
        orderBy.title = order;
        break;
      case 'year':
        orderBy.year = order;
        break;
      default:
        orderBy.popularity = 'desc';
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          genres: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string, userId?: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Get similar movies (same genres)
    const similarMovies = await this.prisma.movie.findMany({
      where: {
        id: { not: movie.id },
        genres: {
          some: {
            id: {
              in: movie.genres.map((g) => g.id),
            },
          },
        },
      },
      take: 6,
      orderBy: { popularity: 'desc' },
      include: {
        genres: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Check if user has favorited/watchlisted
    let isFavorite = false;
    let isInWatchlist = false;

    if (userId) {
      const [favorite, watchlist] = await Promise.all([
        this.prisma.favorite.findUnique({
          where: {
            userId_movieId: {
              userId,
              movieId: movie.id,
            },
          },
        }),
        this.prisma.watchlist.findUnique({
          where: {
            userId_movieId: {
              userId,
              movieId: movie.id,
            },
          },
        }),
      ]);

      isFavorite = !!favorite;
      isInWatchlist = !!watchlist;
    }

    return {
      ...movie,
      similarMovies,
      isFavorite,
      isInWatchlist,
    };
  }

  async create(createMovieDto: CreateMovieDto) {
    // If importing from TMDB
    if (createMovieDto.importTmdbId) {
      return this.importFromTmdb(createMovieDto.importTmdbId);
    }

    // Generate slug
    const slug = slugify(`${createMovieDto.title}-${createMovieDto.year}`, {
      lower: true,
      strict: true,
    });

    // Check if slug exists
    const existing = await this.prisma.movie.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('Movie with this title and year already exists');
    }

    // Create movie
    const { genreIds, ...movieData } = createMovieDto;

    return this.prisma.movie.create({
      data: {
        ...movieData,
        slug,
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
      },
      include: {
        genres: true,
      },
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // If updating title or year, regenerate slug
    let slug = movie.slug;
    if (updateMovieDto.title || updateMovieDto.year) {
      const title = updateMovieDto.title || movie.title;
      const year = updateMovieDto.year || movie.year;
      slug = slugify(`${title}-${year}`, { lower: true, strict: true });
    }

    const { genreIds, ...movieData } = updateMovieDto;

    return this.prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        slug,
        ...(genreIds && {
          genres: {
            set: genreIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        genres: true,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.movie.delete({ where: { id } });
      return { message: 'Movie deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Movie not found');
    }
  }

  async importFromTmdb(tmdbId: number) {
    // Check if already exists
    const existing = await this.prisma.movie.findUnique({
      where: { tmdbId },
    });

    if (existing) {
      throw new BadRequestException('Movie already imported from TMDB');
    }

    // Fetch from TMDB
    const details = await this.tmdb.getMovieDetails(tmdbId);

    if (!details.title || !details.release_date || !details.runtime) {
      throw new BadRequestException('Incomplete movie data from TMDB');
    }

    const year = parseInt(details.release_date.split('-')[0]);
    const slug = slugify(`${details.title}-${year}`, {
      lower: true,
      strict: true,
    });

    // Create movie
    const movie = await this.prisma.movie.create({
      data: {
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
      },
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

    return this.findOne(movie.slug);
  }

  async getStats() {
    const [total, avgRating, totalReviews, topGenres] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.movie.aggregate({
        _avg: { avgRating: true },
      }),
      this.prisma.review.count(),
      this.prisma.genre.findMany({
        take: 10,
        include: {
          _count: {
            select: { movies: true },
          },
        },
        orderBy: {
          movies: {
            _count: 'desc',
          },
        },
      }),
    ]);

    return {
      totalMovies: total,
      averageRating: avgRating._avg.avgRating || 0,
      totalReviews,
      topGenres: topGenres.map((g) => ({
        id: g.id,
        name: g.name,
        movieCount: g._count.movies,
      })),
    };
  }
}
