import { IsString, IsNumber, Min, Max, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix', description: 'The title of the movie' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Sci-Fi', description: 'The genre of the movie' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 136, description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 1999, description: 'Year of release' })
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear())
  release_year: number;

  @ApiProperty({ example: 8.7, description: 'Rating from 0 to 10' })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
} 