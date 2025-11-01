import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe Updated', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty({ example: 'Movie enthusiast and critic', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: any;
}
