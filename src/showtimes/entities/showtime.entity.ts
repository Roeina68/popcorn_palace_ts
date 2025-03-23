import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the showtime' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The price of the showtime ticket', example: 20.2 })
  price: number;

  @Column()
  @ApiProperty({ description: 'The name of the theater', example: 'Sample Theater' })
  theater: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: 'The start time of the showtime', example: '2025-02-14T11:47:46.125405Z' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: 'The end time of the showtime', example: '2025-02-14T14:47:46.125405Z' })
  end_time: Date;

  @Column()
  @ApiProperty({ description: 'The ID of the movie being shown' })
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  @ApiProperty({ description: 'The movie being shown' })
  movie: Movie;
}
