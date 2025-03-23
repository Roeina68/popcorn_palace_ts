import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<{ bookingId: string }> {
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