import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from '../bookings.service';
import { Booking } from '../entities/booking.entity';
import { ConflictException } from '@nestjs/common';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { mockBooking, mockConflictingBooking } from '../__mocks__/mockBooking';

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: Repository<Booking>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      showtimeId: 1,
      seatNumber: 1,
    };

    it('should create a booking successfully', async () => {
      // Mock repository responses
      mockRepository.findOneBy.mockResolvedValue(null); // No existing booking
      mockRepository.create.mockReturnValue(mockBooking);
      mockRepository.save.mockResolvedValue(mockBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual({ bookingId: expect.any(String) });
      expect(result.bookingId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        showtimeId: createBookingDto.showtimeId,
        seatNumber: createBookingDto.seatNumber,
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createBookingDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when seat is already booked', async () => {
      // Mock repository to find existing booking
      mockRepository.findOneBy.mockResolvedValue(mockConflictingBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createBookingDto)).rejects.toThrow('Seat is already booked for this showtime');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        showtimeId: createBookingDto.showtimeId,
        seatNumber: createBookingDto.seatNumber,
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Mock repository to simulate database error
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBooking);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createBookingDto)).rejects.toThrow('Database error');
    });

    it('should validate input DTO', async () => {
      const invalidDto = {
        userId: 'invalid-uuid',
        showtimeId: -1,
        seatNumber: 0,
      } as CreateBookingDto;

      await expect(service.create(invalidDto)).rejects.toThrow();
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
