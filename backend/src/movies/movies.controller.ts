import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { QueryMoviesDto } from './dto/query-movies.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all movies with filters and pagination' })
  @ApiQuery({ type: QueryMoviesDto })
  findAll(@Query() query: QueryMoviesDto) {
    return this.moviesService.findAll(query);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get movies statistics' })
  getStats() {
    return this.moviesService.getStats();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get movie by slug' })
  findOne(@Param('slug') slug: string, @CurrentUser() user?: any) {
    return this.moviesService.findOne(slug, user?.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie (Admin only)' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie (Admin only)' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie (Admin only)' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
