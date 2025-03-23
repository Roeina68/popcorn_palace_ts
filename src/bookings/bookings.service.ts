import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private showtimesService: ShowtimesService,
    private readonly logger: LoggerService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<{ bookingId: string }> {
    // Validate showtime exists
    const showtime = await this.showtimesService.findOne(createBookingDto.showtimeId);
    if (!showtime) {
      this.logger.error(`Booking creation failed: Showtime with id ${createBookingDto.showtimeId} not found`, null, 'BookingsService');
      throw new NotFoundException(`Showtime with id ${createBookingDto.showtimeId} not found`);
    }

    // Validate showtime hasn't started yet
    const now = new Date();
    if (new Date(showtime.startTime) <= now) {
      this.logger.error(`Booking creation failed: Showtime ${createBookingDto.showtimeId} has already started`, null, 'BookingsService');
      throw new BadRequestException('Cannot book tickets for a showtime that has already started');
    }

    // Validate seat number is within theater capacity (assuming 100 seats)
    if (createBookingDto.seatNumber > 100) {
      this.logger.error(`Booking creation failed: Invalid seat number ${createBookingDto.seatNumber} for showtime ${createBookingDto.showtimeId}`, null, 'BookingsService');
      throw new BadRequestException('Invalid seat number. Theater has 100 seats.');
    }

    const existingBooking = await this.bookingsRepository.findOneBy({
      showtimeId: createBookingDto.showtimeId,
      seatNumber: createBookingDto.seatNumber,
    });

    if (existingBooking) {
      this.logger.error(`Booking creation failed: Seat ${createBookingDto.seatNumber} already booked for showtime ${createBookingDto.showtimeId}`, null, 'BookingsService');
      throw new ConflictException('Seat is already booked for this showtime');
    }

    const booking = this.bookingsRepository.create(createBookingDto);
    try {
      const result = await this.bookingsRepository.save(booking);
      this.logger.log(`Booking created successfully: ${result.bookingId} for showtime ${createBookingDto.showtimeId}`, 'BookingsService');
      return { bookingId: result.bookingId };
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(`Booking creation failed: Database unique constraint violation for seat ${createBookingDto.seatNumber}`, error.stack, 'BookingsService');
        throw new ConflictException('Seat is already booked for this showtime');
      }
      this.logger.error(`Booking creation failed: ${error.message}`, error.stack, 'BookingsService');
      throw error;
    }
  }
}