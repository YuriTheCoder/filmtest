import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TmdbService } from './tmdb.service';
import { TmdbSyncService } from './tmdb-sync.service';

@Module({
  imports: [HttpModule],
  providers: [TmdbService, TmdbSyncService],
  exports: [TmdbService, TmdbSyncService],
})
export class TmdbModule {}
