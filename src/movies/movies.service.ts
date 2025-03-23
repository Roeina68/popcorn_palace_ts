import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Movie } from "./entities/movie.entity";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    async create(createMovieDto: CreateMovieDto): Promise<Movie> {
        // Check if movie with this title already exists
        const existingMovie = await this.moviesRepository.findOneBy({ 
            title: createMovieDto.title 
        });
        
        if (existingMovie) {
            throw new ConflictException(`Movie with title "${createMovieDto.title}" already exists`);
        }

        const movie = this.moviesRepository.create(createMovieDto);
        try {
            return await this.moviesRepository.save(movie);
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation code
                throw new ConflictException(`Movie with title "${createMovieDto.title}" already exists`);
            }
            throw error;
        }
    }

    async findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    }

    async findOne(id: number): Promise<Movie> {
        return this.moviesRepository.findOneBy({ id });
    }

    async findOneByTitle(title: string): Promise<Movie> {
        const decodedTitle = decodeURIComponent(title);
        return this.moviesRepository.findOneBy({ title: decodedTitle });
    }

    async update(title: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        const decodedTitle = decodeURIComponent(title);
        const movie = await this.findOneByTitle(decodedTitle);
        if (!movie) {
            throw new NotFoundException(`Movie with title "${decodedTitle}" not found`);
        }

        await this.moviesRepository.update(movie.id, updateMovieDto);
        return this.moviesRepository.findOneBy({ id: movie.id });
    }

    async remove(title: string): Promise<void> {
        const movie = await this.findOneByTitle(title);
        if (!movie) {
            throw new NotFoundException(`Movie with title "${title}" not found`);
        }
        await this.moviesRepository.delete(movie.id);
    }
}