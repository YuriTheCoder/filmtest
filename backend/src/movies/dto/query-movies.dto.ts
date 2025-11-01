import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMoviesDto {
  @ApiProperty({ required: false, description: 'Search query for title/synopsis' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, description: 'Filter by genre IDs', type: [String] })
  @IsOptional()
  @IsArray()
  genres?: string[];

  @ApiProperty({ required: false, description: 'Minimum year', example: 2000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  yearMin?: number;

  @ApiProperty({ required: false, description: 'Maximum year', example: 2024 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(2030)
  yearMax?: number;

  @ApiProperty({ required: false, description: 'Minimum rating (0-10)', example: 7 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiProperty({ required: false, description: 'Maximum runtime in minutes', example: 180 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxRuntime?: number;

  @ApiProperty({ required: false, description: 'Country code', example: 'US' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false, description: 'Language code', example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    required: false,
    description: 'Sort by field',
    enum: ['popularity', 'rating', 'recent', 'title', 'year'],
    default: 'popularity',
  })
  @IsOptional()
  @IsString()
  sort?: 'popularity' | 'rating' | 'recent' | 'title' | 'year';

  @ApiProperty({
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, description: 'Items per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
