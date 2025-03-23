import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty({ description: 'The ID of the movie being shown', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  movieId: number;

  @ApiProperty({ description: 'The name of the theater where the movie is being shown', example: 'Sample Theater' })
  @IsString()
  @IsNotEmpty()
  theater: string;

  @ApiProperty({ description: 'The start time of the showtime (ISO format)', example: '2025-02-14T11:47:46.125Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ description: 'The end time of the showtime (ISO format)', example: '2025-02-14T14:47:46.125Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({ description: 'The price of the showtime ticket (in dollars)', example: 20.2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}
