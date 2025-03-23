import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, MinLength, Min, Max } from 'class-validator';

export class CreateMovieDto {
    @ApiProperty({ description: 'The title of the movie' })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    title: string;

    @ApiProperty({ description: 'The genre of the movie' })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    genre: string;

    @ApiProperty({ description: 'The duration of the movie in minutes' })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    duration: number;

    @ApiProperty({ description: 'The release year of the movie' })
    @IsNumber()
    @IsNotEmpty()
    @Min(1900)
    @Max(new Date().getFullYear())
    releaseYear: number;

    @ApiProperty({ description: 'The rating of the movie' })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(10)
    rating: number;

} 