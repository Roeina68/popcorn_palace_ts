import { Controller, Post, Body, HttpStatus, ValidationPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a ticket' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns booking UUID',
    schema: {
      properties: {
        bookingId: { type: 'string', format: 'uuid' }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Seat is already booked for this showtime' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  @ApiBody({ type: CreateBookingDto })
  async book(@Body(ValidationPipe) createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }
}