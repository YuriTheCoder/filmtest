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
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('watchlist')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Post('movies/:movieId/watchlist')
  @ApiOperation({ summary: 'Toggle watchlist status for a movie' })
  toggle(@Param('movieId') movieId: string, @CurrentUser() user: any) {
    return this.watchlistService.toggle(movieId, user.sub);
  }

  @Get('movies/:movieId/watchlist')
  @ApiOperation({ summary: 'Check if movie is in watchlist' })
  checkWatchlist(@Param('movieId') movieId: string, @CurrentUser() user: any) {
    return this.watchlistService.checkWatchlist(movieId, user.sub);
  }

  @Get('me/watchlist')
  @ApiOperation({ summary: 'Get user watchlist' })
  findByUser(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.watchlistService.findByUser(user.sub, page, limit);
  }
}
