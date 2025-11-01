import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('favorites')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post('movies/:movieId/favorite')
  @ApiOperation({ summary: 'Toggle favorite status for a movie' })
  toggle(@Param('movieId') movieId: string, @CurrentUser() user: any) {
    return this.favoritesService.toggle(movieId, user.sub);
  }

  @Get('movies/:movieId/favorite')
  @ApiOperation({ summary: 'Check if movie is favorited' })
  checkFavorite(@Param('movieId') movieId: string, @CurrentUser() user: any) {
    return this.favoritesService.checkFavorite(movieId, user.sub);
  }

  @Get('me/favorites')
  @ApiOperation({ summary: 'Get user favorites' })
  findByUser(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.favoritesService.findByUser(user.sub, page, limit);
  }
}
