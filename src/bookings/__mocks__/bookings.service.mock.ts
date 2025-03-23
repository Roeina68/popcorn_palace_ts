import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { mockBooking, mockConflictingBooking, mockInvalidShowtimeBooking } from './mockBooking';
import { CreateBookingDto } from '../dtos/create-booking.dto';

@Injectable()
export class BookingsServiceMock {
  private bookings = [mockBooking];

  async create(createBookingDto: CreateBookingDto): Promise<{ bookingId: string }> {
    // Simulate seat conflict check
    const existingBooking = this.bookings.find(
      booking => 
        booking.showtimeId === createBookingDto.showtimeId && 
        booking.seatNumber === createBookingDto.seatNumber
    );

    if (existingBooking) {
      throw new ConflictException('Seat is already booked for this showtime');
    }

    // Simulate invalid showtime check
    if (createBookingDto.showtimeId === mockInvalidShowtimeBooking.showtimeId) {
      throw new ConflictException('Showtime does not exist');
    }

    // Create new booking
    const newBooking = {
      bookingId: '550e8400-e29b-41d4-a716-446655440003',
      ...createBookingDto,
      showtime: mockBooking.showtime
    };

    this.bookings.push(newBooking);
    return { bookingId: newBooking.bookingId };
  }

  // Helper method to reset mock data
  reset() {
    this.bookings = [mockBooking];
  }

  // Helper method to get all bookings
  getAllBookings() {
    return this.bookings;
  }
}
