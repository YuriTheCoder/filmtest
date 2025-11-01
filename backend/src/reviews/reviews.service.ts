import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(movieId: string, userId: string, createReviewDto: CreateReviewDto) {
    // Check if movie exists
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if user already reviewed this movie
    const existing = await this.prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You already reviewed this movie');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
        movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update movie average rating
    await this.updateMovieRating(movieId);

    return review;
  }

  async findByMovie(movieId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { movieId },
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      this.prisma.review.count({ where: { movieId } }),
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

  async findByUser(userId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              slug: true,
              year: true,
              posterUrl: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where: { userId } }),
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

  async update(id: string, userId: string, updateData: Partial<CreateReviewDto>) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update movie average rating if rating changed
    if (updateData.rating !== undefined) {
      await this.updateMovieRating(review.movieId);
    }

    return updated;
  }

  async remove(id: string, userId: string, isAdmin: boolean = false) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({ where: { id } });

    // Update movie average rating
    await this.updateMovieRating(review.movieId);

    return { message: 'Review deleted successfully' };
  }

  private async updateMovieRating(movieId: string) {
    const result = await this.prisma.review.aggregate({
      where: { movieId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        avgRating: result._avg.rating || 0,
        ratingsCount: result._count.rating,
      },
    });
  }
}
