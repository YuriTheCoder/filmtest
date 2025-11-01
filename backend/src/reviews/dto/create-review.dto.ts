import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 8, description: 'Rating from 0-10' })
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({ example: 'Amazing movie!', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ example: 'This movie was incredible...', required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  body?: string;
}
