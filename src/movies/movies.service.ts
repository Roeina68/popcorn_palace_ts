import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Movie } from "./entities/movie.entity";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { LoggerService } from "../common/services/logger.service";
import { 
    MovieNotFoundException, 
    MovieAlreadyExistsException, 
    InvalidMovieDataException 
} from "../common/exceptions/movie.exception";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        private readonly logger: LoggerService,
    ) {}

    async create(createMovieDto: CreateMovieDto): Promise<Movie> {
        // Check if movie with this title already exists
        const existingMovie = await this.moviesRepository.findOneBy({ 
            title: createMovieDto.title 
        });
        
        if (existingMovie) {
            this.logger.error(`Movie creation failed: Title "${createMovieDto.title}" already exists`, null, 'MoviesService');
            throw new MovieAlreadyExistsException(createMovieDto.title);
        }

        const movie = this.moviesRepository.create(createMovieDto);
        try {
            const savedMovie = await this.moviesRepository.save(movie);
            this.logger.log(`Movie created successfully: ${savedMovie.title}`, 'MoviesService');
            return savedMovie;
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation code
                this.logger.error(`Movie creation failed: Database unique constraint violation for title "${createMovieDto.title}"`, error.stack, 'MoviesService');
                throw new MovieAlreadyExistsException(createMovieDto.title);
            }
            this.logger.error(`Movie creation failed: ${error.message}`, error.stack, 'MoviesService');
            throw new InvalidMovieDataException("Movie creation failed");
        }
    }

    async findAll(): Promise<Movie[]> {
        const movies = await this.moviesRepository.find();
        this.logger.log(`Retrieved ${movies.length} movies`, 'MoviesService');
        return movies;
    }

    async findOne(id: number): Promise<Movie> {
        const movie = await this.moviesRepository.findOneBy({ id });
        if (!movie) {
            this.logger.error(`Movie not found with ID: ${id}`, null, 'MoviesService');
            throw new MovieNotFoundException(id.toString());
        }
        this.logger.log(`Retrieved movie: ${movie.title}`, 'MoviesService');
        return movie;
    }

    async findOneByTitle(title: string): Promise<Movie> {
        const decodedTitle = decodeURIComponent(title);
        const movie = await this.moviesRepository.findOneBy({ title: decodedTitle });
        if (!movie) {
            this.logger.error(`Movie not found with title: ${decodedTitle}`, null, 'MoviesService');
            throw new MovieNotFoundException(decodedTitle);
        }
        this.logger.log(`Retrieved movie: ${movie.title}`, 'MoviesService');
        return movie;
    }

    async update(title: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        const decodedTitle = decodeURIComponent(title);
        const movie = await this.findOneByTitle(decodedTitle);
        if (!movie) {
            this.logger.error(`Movie update failed: Title "${decodedTitle}" not found`, null, 'MoviesService');
            throw new MovieNotFoundException(decodedTitle);
        }

        try {
            await this.moviesRepository.update(movie.id, updateMovieDto);
            const updatedMovie = await this.moviesRepository.findOneBy({ id: movie.id });
            this.logger.log(`Movie updated successfully: ${updatedMovie.title}`, 'MoviesService');
            return updatedMovie;
        } catch (error) {
            this.logger.error(`Movie update failed: ${error.message}`, error.stack, 'MoviesService');
            throw new InvalidMovieDataException("Movie update failed");
        }
    }

    async remove(title: string): Promise<void> {
        const decodedTitle = decodeURIComponent(title);
        const movie = await this.findOneByTitle(decodedTitle);
        if (!movie) {
            this.logger.error(`Movie removal failed: Title "${decodedTitle}" not found`, null, 'MoviesService');
            throw new MovieNotFoundException(decodedTitle);
        }

        try {
            await this.moviesRepository.delete(movie.id);
            this.logger.log(`Movie removed successfully: ${movie.title}`, 'MoviesService');
        } catch (error) {
            this.logger.error(`Movie removal failed: ${error.message}`, error.stack, 'MoviesService');
            throw new InvalidMovieDataException("Movie removal failed");
        }
    }
}