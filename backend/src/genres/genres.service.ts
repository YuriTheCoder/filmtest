import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        _count: {
          select: { movies: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { slug },
      include: {
        movies: {
          take: 20,
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
        },
        _count: {
          select: { movies: true },
        },
      },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async create(name: string) {
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await this.prisma.genre.findUnique({ where: { slug } });
    if (existing) {
      throw new BadRequestException('Genre already exists');
    }

    return this.prisma.genre.create({
      data: { name, slug },
    });
  }

  async update(id: string, name: string) {
    const slug = slugify(name, { lower: true, strict: true });

    try {
      return await this.prisma.genre.update({
        where: { id },
        data: { name, slug },
      });
    } catch (error) {
      throw new NotFoundException('Genre not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.genre.delete({ where: { id } });
      return { message: 'Genre deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Genre not found');
    }
  }
}
