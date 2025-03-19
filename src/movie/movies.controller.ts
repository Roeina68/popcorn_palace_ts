import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Movie } from "./movie.model";
import { MoviesService } from "./movies.service";

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    getMovie() : any{
        return this.moviesService.getAllMovies();
    }

    @Post()
    createMovie(@Body() movie: Movie) {
        return this.moviesService.createMovie(movie);
    }

    @Delete(':id')
    deleteMovie(@Param('id') id: string) {
        return this.moviesService.deleteMovie(id);
    }
}
