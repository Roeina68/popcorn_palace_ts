import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private showtimesService: ShowtimesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<{ bookingId: string }> {
    // Validate showtime exists
    const showtime = await this.showtimesService.findOne(createBookingDto.showtimeId);
    if (!showtime) {
      throw new NotFoundException(`Showtime with id ${createBookingDto.showtimeId} not found`);
    }

    // Validate showtime hasn't started yet
    const now = new Date();
    if (new Date(showtime.startTime) <= now) {
      throw new BadRequestException('Cannot book tickets for a showtime that has already started');
    }

    // Validate seat number is within theater capacity (assuming 100 seats)
    if (createBookingDto.seatNumber > 100) {
      throw new BadRequestException('Invalid seat number. Theater has 100 seats.');
    }

    const existingBooking = await this.bookingsRepository.findOneBy({
      showtimeId: createBookingDto.showtimeId,
      seatNumber: createBookingDto.seatNumber,
    });

    if (existingBooking) {
      throw new ConflictException('Seat is already booked for this showtime');
    }

    const booking = this.bookingsRepository.create(createBookingDto);
    try {
      const result = await this.bookingsRepository.save(booking);
      return { bookingId: result.bookingId };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Seat is already booked for this showtime');
      }
      throw error;
    }
  }
}