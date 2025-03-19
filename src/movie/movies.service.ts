import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./movie.model";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
      ) {}

      async create(movie: Movie): Promise<Movie> {
        const createdMovie = this.moviesRepository.create(movie);
        return this.moviesRepository.save(createdMovie);
      }

      async findAll(): Promise<Movie[]> {
        return this.moviesRepository.find();
      }

      async findOne(id: number): Promise<Movie> {
        return this.moviesRepository.findOneBy({ id });
      }

      async update(id: number, title: string, genre: string, duration: number, release_year: number, rating: number): Promise<Movie> {
        await this.moviesRepository.update(id, { title, genre, duration, release_year, rating });
        return this.moviesRepository.findOneBy({ id });
      }

      async remove(id: number): Promise<void> {
        await this.moviesRepository.delete(id);
      }
    
      
}