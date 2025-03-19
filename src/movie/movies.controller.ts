import { Controller, Get, Post, Body, Delete, Param, Patch } from "@nestjs/common";
import { Movie } from "./movie.model";
import { MoviesService } from "./movies.service";

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    async getMovie(){
        return this.moviesService.findAll();
    }

    @Post()
    async createMovie(@Body() movie: Movie) {
        return this.moviesService.create(movie);
    }

    @Delete(':id')
    async deleteMovie(@Param('id') id: string) {
        await this.moviesService.remove(Number(id));
        return { message: 'Movie deleted successfully' };
    }

    @Patch(':id')
    async updateMovie(@Param('id') id: string, @Body() body: { title: string, genre: string, duration: number, release_year: number, rating: number }) {
        return this.moviesService.update(Number(id), body.title, body.genre, body.duration, body.release_year, body.rating);
    }
}
