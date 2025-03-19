import { Movie } from "./movie.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAllMovies(){
        return this.movies;
    }

    getMovieById(id: string): Movie{
        return this.movies.find((movie) => movie.id === id);
    }
    
    createMovie(movie: Movie){
        this.movies.push(movie);
        return movie;
    }
    
    
}