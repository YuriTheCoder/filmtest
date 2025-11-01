import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';

@Module({
  providers: [GenresService],
  controllers: [GenresController],
  exports: [GenresService],
})
export class GenresModule {}
