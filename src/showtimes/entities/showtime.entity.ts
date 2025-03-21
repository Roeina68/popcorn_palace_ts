import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Showtime {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of the showtime' })
    id: number;

    @ManyToOne(() => Movie)
    @ApiProperty({ description: 'The movie being shown' })
    movie: Movie;

    @Column()
    @ApiProperty({ description: 'The theater in which the movie is being shown' })
    theater: number;

    @Column()
    @ApiProperty({ description: 'The start time of the showtime' })
    start_time: Date;

    @Column()
    @ApiProperty({ description: 'The end time of the showtime' })
    end_time: Date;
    
    @Column()
    @ApiProperty({ description: 'The price of the showtime' })
    price: number;
}
