import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of the movie' })
    id: number;

    @Column({ unique: true })
    @ApiProperty({ description: 'The title of the movie' })
    movieTitle: string;

    @Column()
    @ApiProperty({ description: 'The description of the movie' })
    description: string;

    @Column()
    @ApiProperty({ description: 'The release year of the movie' })
    releaseYear: number;

    @Column()
    @ApiProperty({ description: 'The duration of the movie in minutes' })
    duration: number;

    @Column()
    @ApiProperty({ description: 'The genre of the movie' })
    genre: string;
} 