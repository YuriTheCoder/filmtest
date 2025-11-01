import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHealth() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'connected',
        uptime: process.uptime(),
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  async getMetrics() {
    const [
      totalMovies,
      totalUsers,
      totalReviews,
      totalFavorites,
      totalWatchlist,
    ] = await Promise.all([
      this.prisma.movie.count(),
      this.prisma.user.count(),
      this.prisma.review.count(),
      this.prisma.favorite.count(),
      this.prisma.watchlist.count(),
    ]);

    return {
      movies: totalMovies,
      users: totalUsers,
      reviews: totalReviews,
      favorites: totalFavorites,
      watchlist: totalWatchlist,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}
