import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['showtimeId', 'seatNumber'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'UUID of the booking' })
  bookingId: string;

  @Column()
  @ApiProperty({ description: 'UUID of the user' })
  userId: string;

  @Column()
  @ApiProperty({ description: 'ID of the showtime' })
  showtimeId: number;

  @Column()
  @ApiProperty({ description: 'Seat number for the booking' })
  seatNumber: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtimeId' })
  @ApiProperty({ type: () => Showtime }) // <-- ADD this
  showtime: Showtime;
}