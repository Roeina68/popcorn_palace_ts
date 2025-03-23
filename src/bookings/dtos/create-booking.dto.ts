import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'UUID of the user making the booking' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID of the showtime' })
  @IsNumber()
  showtimeId: number;

  @ApiProperty({ description: 'Seat number being booked (must be >= 1)' })
  @IsNumber()
  @Min(1)
  seatNumber: number;
}