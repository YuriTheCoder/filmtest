import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async toggle(movieId: string, userId: string) {
    // Check if movie exists
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if already in watchlist
    const existing = await this.prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existing) {
      // Remove from watchlist
      await this.prisma.watchlist.delete({ where: { id: existing.id } });
      return { isInWatchlist: false, message: 'Removed from watchlist' };
    } else {
      // Add to watchlist
      await this.prisma.watchlist.create({
        data: {
          userId,
          movieId,
        },
      });
      return { isInWatchlist: true, message: 'Added to watchlist' };
    }
  }

  async findByUser(userId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await Promise.all([
      this.prisma.watchlist.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          movie: {
            include: {
              genres: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.watchlist.count({ where: { userId } }),
    ]);

    return {
      data: data.map((w) => w.movie),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkWatchlist(movieId: string, userId: string) {
    const watchlist = await this.prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    return { isInWatchlist: !!watchlist };
  }
}
