import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the movie' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'The Matrix', description: 'The title of the movie' })
  title: string;

  @Column()
  @ApiProperty({ example: 'Sci-Fi', description: 'The genre of the movie' })
  genre: string;

  @Column({ default: 0 })
  @ApiProperty({ example: 136, description: 'Duration in minutes' })
  duration: number;

  @Column({ default: new Date().getFullYear() })
  @ApiProperty({ example: 1999, description: 'Year of release' })
  release_year: number;

  @Column({ type: 'float', default: 0 })
  @ApiProperty({ example: 8.7, description: 'Rating from 0 to 10' })
  rating: number;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
} 