import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the showtime' })
  id: number;

  @Column({ type: 'float', default: 0 })
  @ApiProperty({ example: 10.5, description: 'The price of the showtime ticket' })
  price: number;

  @Column()
  @ApiProperty({ example: 'Sample Theater', description: 'The name of the theater' })
  theater: string;

  @Column({ name: 'start_time', type: 'timestamp' })
  @ApiProperty({ example: '2025-02-14T11:47:46.125405Z', description: 'The start time of the showtime' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  @ApiProperty({ example: '2025-02-14T14:47:46.125405Z', description: 'The end time of the showtime' })
  endTime: Date;

  @Column()
  @ApiProperty({ example: 1, description: 'The ID of the movie being shown' })
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  @ApiProperty({ example: 1, description: 'The ID of the movie being shown', type: () => Movie })
  movie: Movie;

  @OneToMany(() => Booking, (booking) => booking.showtime)
  @ApiProperty({ type: () => [Booking] })
  bookings: Booking[];
}
