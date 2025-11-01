import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsUrl,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'A thief who steals corporate secrets...' })
  @IsString()
  @MinLength(10)
  synopsis: string;

  @ApiProperty({ example: 2010 })
  @IsInt()
  @Min(1900)
  @Max(2030)
  year: number;

  @ApiProperty({ example: 148 })
  @IsInt()
  @Min(1)
  @Max(500)
  runtime: number;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  originalLanguage?: string;

  @ApiProperty({ example: ['Christopher Nolan'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  directors: string[];

  @ApiProperty({
    example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  cast: string[];

  @ApiProperty({ example: 'PG-13', required: false })
  @IsOptional()
  @IsString()
  parentalRating?: string;

  @ApiProperty({ example: ['genre-id-1', 'genre-id-2'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  genreIds: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  backdropUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;

  @ApiProperty({ required: false, description: 'Import from TMDB by ID' })
  @IsOptional()
  @IsInt()
  importTmdbId?: number;
}
