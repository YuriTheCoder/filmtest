import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbSyncService } from '../tmdb/tmdb-sync.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private tmdbSync: TmdbSyncService,
  ) {}

  async getDashboardStats() {
    const [
      totalMovies,
      totalUsers,
      totalReviews,
      totalFavorites,
      totalWatchlist,
      avgRating,
      recentUsers,
      recentMovies,
      topGenres,
      recentReviews,
    ] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.user.count(),
      this.prisma.review.count(),
      this.prisma.favorite.count(),
      this.prisma.watchlist.count(),
      this.prisma.movie.aggregate({
        _avg: { avgRating: true },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
              watchlist: true,
            },
          },
        },
      }),
      this.prisma.movie.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          year: true,
          posterUrl: true,
          avgRating: true,
          createdAt: true,
        },
      }),
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
      this.prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          movie: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    return {
      stats: {
        totalMovies,
        totalUsers,
        totalReviews,
        totalFavorites,
        totalWatchlist,
        avgRating: avgRating._avg.avgRating || 0,
      },
      recentUsers,
      recentMovies,
      topGenres: topGenres.map((g) => ({
        id: g.id,
        name: g.name,
        movieCount: g._count.movies,
      })),
      recentReviews,
    };
  }

  async syncTmdb() {
    return this.tmdbSync.syncMovies();
  }

  async getSyncLogs(page: number = 1, limit: number = 20) {
    const [data, total] = await Promise.all([
      this.prisma.syncLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.syncLog.count(),
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

  async getAllUsers(page: number = 1, limit: number = 20) {
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
              watchlist: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
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

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async updateUserRole(id: string, role: 'USER' | 'ADMIN') {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  }
}
