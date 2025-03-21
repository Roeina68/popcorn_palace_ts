import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    async findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    }

    async findOne(id: number): Promise<Movie> {
        const movie = await this.moviesRepository.findOne({ where: { id } });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }

    async findOneByTitle(title: string): Promise<Movie> {
        const decodedTitle = decodeURIComponent(title);
        const movie = await this.moviesRepository.findOne({ where: { movieTitle: decodedTitle } });
        if (!movie) {
            throw new NotFoundException(`Movie with title "${decodedTitle}" not found`);
        }
        return movie;
    }

    async create(createMovieDto: Partial<Movie>): Promise<Movie> {
        try {
            const movie = this.moviesRepository.create(createMovieDto);
            return await this.moviesRepository.save(movie);
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation code
                throw new ConflictException(`Movie with title "${createMovieDto.movieTitle}" already exists`);
            }
            throw error;
        }
    }

    async update(title: string, updateMovieDto: Partial<Movie>): Promise<Movie> {
        const movie = await this.findOneByTitle(title);
        Object.assign(movie, updateMovieDto);
        return this.moviesRepository.save(movie);
    }

    async remove(title: string): Promise<void> {
        const movie = await this.findOneByTitle(title);
        await this.moviesRepository.remove(movie);
    }
} 