import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from '../bookings.controller';
import { BookingsServiceMock } from '../__mocks__/bookings.service.mock';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { ConflictException } from '@nestjs/common';
import { mockBooking, mockConflictingBooking } from '../__mocks__/mockBooking';
import { BookingsService } from '../bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useClass: BookingsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsServiceMock>(BookingsService);
});

  afterEach(() => {
    service.reset();
  });

  describe('book', () => {
    it('should create a booking successfully', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        showtimeId: 2,
        seatNumber: 2,
      };

      const result = await controller.book(createBookingDto);
      expect(result).toEqual({
        bookingId: expect.any(String),
      });
      expect(result.bookingId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should throw ConflictException when seat is already booked', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        showtimeId: mockBooking.showtimeId,
        seatNumber: mockBooking.seatNumber,
      };

      await expect(controller.book(createBookingDto)).rejects.toThrow(ConflictException);
      await expect(controller.book(createBookingDto)).rejects.toThrow('Seat is already booked for this showtime');
    });

    it('should throw ConflictException for non-existent showtime', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: '123e4567-e89b-12d3-a456-426614174002',
        showtimeId: 999,
        seatNumber: 1,
      };

      await expect(controller.book(createBookingDto)).rejects.toThrow(ConflictException);
      await expect(controller.book(createBookingDto)).rejects.toThrow('Showtime does not exist');
    });

    it('should validate booking DTO', async () => {
      const invalidDto = {
        userId: 'invalid-uuid',
        showtimeId: -1,
        seatNumber: 0,
      };

      await expect(controller.book(invalidDto as CreateBookingDto)).rejects.toThrow();
    });
  });
});
