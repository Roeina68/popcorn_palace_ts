import { Booking } from '../entities/booking.entity';

export const mockBooking: Booking = {
  bookingId: '550e8400-e29b-41d4-a716-446655440000',
  userId: '123e4567-e89b-12d3-a456-426614174000',
  showtimeId: 1,
  seatNumber: 1,
  showtime: {
    id: 1,
    movieId: 1,
    theater: 'Sample Theater',
    startTime: new Date('2025-02-14T11:47:46.125Z'),
    endTime: new Date('2025-02-14T14:47:46.125Z'),
    price: 20.2,
    movie: {
      id: 1,
      title: 'The Matrix',
      genre: 'Sci-Fi',
      duration: 136,
      releaseYear: 1999,
      rating: 8.7,
      showtimes: [],
    },
    bookings: [],
  },
};

// Mock for seat conflict scenario
export const mockConflictingBooking: Booking = {
  bookingId: '550e8400-e29b-41d4-a716-446655440001',
  userId: '123e4567-e89b-12d3-a456-426614174001',
  showtimeId: 1,
  seatNumber: 1, // Same seat as mockBooking
  showtime: {
    id: 1,
    movieId: 1,
    theater: 'Sample Theater',
    startTime: new Date('2025-02-14T11:47:46.125Z'),
    endTime: new Date('2025-02-14T14:47:46.125Z'),
    price: 20.2,
    movie: {
      id: 1,
      title: 'The Matrix',
      genre: 'Sci-Fi',
      duration: 136,
      releaseYear: 1999,
      rating: 8.7,
      showtimes: [],
    },
    bookings: [mockBooking],
  },
};

// Mock for non-existent showtime
export const mockInvalidShowtimeBooking: Booking = {
  bookingId: '550e8400-e29b-41d4-a716-446655440002',
  userId: '123e4567-e89b-12d3-a456-426614174002',
  showtimeId: 999, // Non-existent showtime ID
  seatNumber: 1,
  showtime: null, // Showtime doesn't exist
};

export const mockBookingArray: Booking[] = [mockBooking];
