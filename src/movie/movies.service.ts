import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./movie.model";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    async create(createMovieDto: CreateMovieDto): Promise<Movie> {
        const movie = this.moviesRepository.create(createMovieDto);
        return this.moviesRepository.save(movie);
    }

    async findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
    }

    async findOne(id: number): Promise<Movie> {
        return this.moviesRepository.findOneBy({ id });
    }

    async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
        await this.moviesRepository.update(id, updateMovieDto);
        return this.moviesRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.moviesRepository.delete(id);
    }
}