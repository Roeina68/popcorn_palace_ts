import { Controller, Get, Post, Body, Delete, Param, Patch, HttpStatus, NotFoundException, ValidationPipe } from "@nestjs/common";
import { Movie } from "./movie.model";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    @ApiOperation({ summary: 'Get all movies' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns all movies', type: [Movie] })
    async getAllMovies(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a movie by id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns the movie', type: Movie })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
    async getMovie(@Param('id') id: string): Promise<Movie> {
        const movie = await this.moviesService.findOne(Number(id));
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }

    @Post()
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Movie created successfully', type: Movie })
    async createMovie(@Body(ValidationPipe) createMovieDto: CreateMovieDto): Promise<Movie> {
        return this.moviesService.create(createMovieDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a movie' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Movie deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
    async deleteMovie(@Param('id') id: string) {
        const movie = await this.moviesService.findOne(Number(id));
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        await this.moviesService.remove(Number(id));
        return { message: 'Movie deleted successfully' };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a movie' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Movie updated successfully', type: Movie })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
    async updateMovie(
        @Param('id') id: string,
        @Body(ValidationPipe) updateMovieDto: UpdateMovieDto
    ): Promise<Movie> {
        const movie = await this.moviesService.findOne(Number(id));
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return this.moviesService.update(Number(id), updateMovieDto);
    }
}
