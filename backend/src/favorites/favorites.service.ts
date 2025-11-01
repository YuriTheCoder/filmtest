import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(movieId: string, userId: string) {
    // Check if movie exists
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if already favorited
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      // Add to favorites
      await this.prisma.favorite.create({
        data: {
          userId,
          movieId,
        },
      });
      return { isFavorite: true, message: 'Added to favorites' };
    }
  }

  async findByUser(userId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await Promise.all([
      this.prisma.favorite.findMany({
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
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      data: data.map((f) => f.movie),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkFavorite(movieId: string, userId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    return { isFavorite: !!favorite };
  }
}
