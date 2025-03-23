import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsDateString, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty({ description: 'The ID of the movie being shown', example: 1 })
  @IsNumber()
  movieId: number;

  @ApiProperty({ description: 'The name of the theater where the movie is being shown', example: 'Sample Theater' })
  @IsString()
  theater: string;

  @ApiProperty({ description: 'The start time of the showtime (ISO format)', example: '2025-02-14T11:47:46.125Z' })
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'The end time of the showtime (ISO format)', example: '2025-02-14T14:47:46.125Z' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'The price of the showtime ticket (in dollars)', example: 20.2 })
  @IsNumber()
  @Min(0)
  price: number;
}
