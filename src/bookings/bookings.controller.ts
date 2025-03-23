import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a ticket' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns booking UUID' })
  async book(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }
}