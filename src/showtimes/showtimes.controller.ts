import { Controller, Get, Post, Body, Delete, Param, Patch, HttpStatus, NotFoundException, ValidationPipe, ParseIntPipe } from "@nestjs/common";
import { Showtime } from "./entities/showtime.entity";
import { ShowtimesService } from "./showtimes.service";
import { CreateShowtimeDto } from "./dtos/create-showtime.dto";
import { UpdateShowtimeDto } from "./dtos/update-showtime.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { DefaultApiResponses } from '../common/decorators/swagger/default-api-responses.decorator';


@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
    constructor(private readonly showtimesService: ShowtimesService) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all showtimes' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns all showtimes', type: [Showtime]})
    @DefaultApiResponses()
    async getAllShowtimes(): Promise<Showtime[]> {
        return this.showtimesService.findAll();
    }

    @Get()
    @ApiOperation({ summary: 'Get all showtimes (alternative route)' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns all showtimes', type: [Showtime]})
    @DefaultApiResponses()

    async getShowtimes(): Promise<Showtime[]> {
        return this.showtimesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a showtime by id' })
    @ApiParam({ name: 'id', type: Number, description: 'The id of the showtime to get' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Returns showtime with provided id', type: Showtime})
    @DefaultApiResponses()
    async getShowtimeByID(@Param('id') id: number): Promise<Showtime>{
        const showtime = await this.showtimesService.findOne(id);
        if (!showtime) {
            throw new NotFoundException(`Showtime with id ${id} not found`);
        }
        return showtime;
    }

    @Post()
    @ApiOperation({ summary: 'Create a new showtime' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Showtime created successfully', type: Showtime})
    @DefaultApiResponses()

    async createShowtime(@Body(ValidationPipe) createShowtimeDto: CreateShowtimeDto): Promise<Showtime>{
        return this.showtimesService.create(createShowtimeDto);
    }

    @Post('update/:id')
    @ApiOperation({ summary: 'Update a showtime by id' })
    @ApiParam({ name: 'id', type: Number, description: 'The id of the showtime to update' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Showtime updated successfully', type: Showtime})
    @DefaultApiResponses()
    async update(
        @Param('id') id: number, 
        @Body(ValidationPipe) updateShowtimeDto: UpdateShowtimeDto,
    ): Promise<Showtime>{
        return this.showtimesService.update(id, updateShowtimeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a showtime by id' })
    @ApiParam({ name: 'id', type: Number, description: 'The id of the showtime to delete' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Showtime deleted successfully'})
    @DefaultApiResponses()
    async remove(@Param('id') id: number): Promise<void> {
        return this.showtimesService.remove(id);
    }
}

