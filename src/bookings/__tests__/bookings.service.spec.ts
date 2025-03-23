import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from '../bookings.service';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { mockBooking, mockConflictingBooking } from '../__mocks__/mockBooking';
import { ShowtimesService } from '../../showtimes/showtimes.service';
import { LoggerService } from '../../common/services/logger.service';
import {
    BookingNotFoundException,
    BookingAlreadyExistsException,
    InvalidBookingDataException,
    ShowtimeFullException,
    InvalidSeatException,
    BookingExpiredException
} from '../../common/exceptions/booking.exception';

const mockShowtimesService = {
  findOne: jest.fn(),
};

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: Repository<Booking>;
  let showtimesService: ShowtimesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const futureShowtime = {
    id: 1,
    startTime: new Date(Date.now() + 100000), // 100 seconds in the future
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
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
      mockShowtimesService.findOne.mockResolvedValue(futureShowtime);
      mockRepository.findOneBy.mockResolvedValue(null);
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

    it('should throw BookingAlreadyExistsException when seat is already booked', async () => {
      mockShowtimesService.findOne.mockResolvedValue(futureShowtime);
      mockRepository.findOneBy.mockResolvedValue(mockConflictingBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(BookingAlreadyExistsException);
      await expect(service.create(createBookingDto)).rejects.toThrow(`Seat ${createBookingDto.seatNumber} is already booked for showtime ${createBookingDto.showtimeId}`);

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw InvalidBookingDataException for database errors', async () => {
      mockShowtimesService.findOne.mockResolvedValue(futureShowtime);
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBooking);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createBookingDto)).rejects.toThrow(InvalidBookingDataException);
    });

    it('should throw InvalidBookingDataException for invalid showtime', async () => {
      mockShowtimesService.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toThrow(InvalidBookingDataException);
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw InvalidSeatException for invalid seat number', async () => {
      const invalidDto = {
        ...createBookingDto,
        seatNumber: 101, // Assuming theater has 100 seats
      };

      mockShowtimesService.findOne.mockResolvedValue(futureShowtime);

      await expect(service.create(invalidDto)).rejects.toThrow(InvalidSeatException);
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BookingExpiredException for past showtime', async () => {
      const pastShowtime = {
        id: 1,
        startTime: new Date(Date.now() - 100000), // 100 seconds in the past
      };

      mockShowtimesService.findOne.mockResolvedValue(pastShowtime);

      await expect(service.create(createBookingDto)).rejects.toThrow(BookingExpiredException);
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  });
