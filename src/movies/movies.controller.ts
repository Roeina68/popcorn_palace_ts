import { Controller, Get, Post, Body, Delete, Param, Patch, HttpStatus, NotFoundException, ValidationPipe, ParseIntPipe } from "@nestjs/common";
import { Movie } from "./entities/movie.entity";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dtos/create-movie.dto";
import { UpdateMovieDto } from "./dtos/update-movie.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all movies' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns all movies', type: [Movie] })
    async getAllMovies(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Get()
    @ApiOperation({ summary: 'Get all movies (alternative route)' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns all movies', type: [Movie] })
    async getMovies(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a movie by id' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns the movie', type: Movie })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
    async getMovie(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
        const movie = await this.moviesService.findOne(id);
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

    @Post('update/:movieTitle')
    @ApiOperation({ summary: 'Update a movie by title' })
    @ApiParam({ name: 'movieTitle', type: 'string', description: 'Movie title' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Movie updated successfully', type: Movie })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
    async updateMovie(
        @Param('movieTitle') movieTitle: string,
        @Body(ValidationPipe) updateMovieDto: UpdateMovieDto
    ): Promise<Movie> {
        return this.moviesService.update(movieTitle, updateMovieDto);
    }

    @Delete(':movieTitle')
    @ApiOperation({ summary: 'Delete a movie by title' })
    @ApiParam({ name: 'movieTitle', type: 'string', description: 'Movie title' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Movie deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found' })
    async deleteMovie(@Param('movieTitle') movieTitle: string) {
        const movie = await this.moviesService.findOneByTitle(movieTitle);
        if (!movie) {
            throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
        }
        await this.moviesService.remove(movie.id);
        return { message: 'Movie deleted successfully' };
    }
} 