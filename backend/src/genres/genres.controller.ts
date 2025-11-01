import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all genres with movie counts' })
  findAll() {
    return this.genresService.findAll();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get genre by slug with movies' })
  findOne(@Param('slug') slug: string) {
    return this.genresService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new genre (Admin only)' })
  create(@Body('name') name: string) {
    return this.genresService.create(name);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a genre (Admin only)' })
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.genresService.update(id, name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a genre (Admin only)' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
