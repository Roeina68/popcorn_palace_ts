import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all movies' })
    @ApiResponse({ status: 200, description: 'Returns all movies' })
    findAll(): Promise<Movie[]> {
        return this.moviesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a movie by ID' })
    @ApiResponse({ status: 200, description: 'Returns the movie' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
        return this.moviesService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiResponse({ status: 201, description: 'Movie created successfully' })
    @ApiResponse({ status: 409, description: 'Movie title already exists' })
    create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
        return this.moviesService.create(createMovieDto);
    }

    @Post('update/:movieTitle')
    @ApiOperation({ summary: 'Update a movie by title' })
    @ApiResponse({ status: 200, description: 'Movie updated successfully' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    update(
        @Param('movieTitle') movieTitle: string,
        @Body() updateMovieDto: UpdateMovieDto,
    ): Promise<Movie> {
        return this.moviesService.update(movieTitle, updateMovieDto);
    }

    @Delete(':movieTitle')
    @ApiOperation({ summary: 'Delete a movie by title' })
    @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    remove(@Param('movieTitle') movieTitle: string): Promise<void> {
        return this.moviesService.remove(movieTitle);
    }
} 