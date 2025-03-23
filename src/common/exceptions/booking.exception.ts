import { HttpException, HttpStatus } from '@nestjs/common';

export class BookingNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Booking with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class BookingAlreadyExistsException extends HttpException {
  constructor(showtimeId: string, seatNumber: string) {
    super(`Seat ${seatNumber} is already booked for showtime ${showtimeId}`, HttpStatus.CONFLICT);
  }
}

export class InvalidBookingDataException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ShowtimeFullException extends HttpException {
  constructor(showtimeId: string) {
    super(`Showtime ${showtimeId} is already fully booked`, HttpStatus.CONFLICT);
  }
}

export class InvalidSeatException extends HttpException {
  constructor(seatNumber: string) {
    super(`Invalid seat number: ${seatNumber}`, HttpStatus.BAD_REQUEST);
  }
}

export class BookingExpiredException extends HttpException {
  constructor(bookingId: string) {
    super(`Booking ${bookingId} has expired`, HttpStatus.GONE);
  }
} 