import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Showtime } from "./entities/showtime.entity";
import { CreateShowtimeDto } from "./dtos/create-showtime.dto";
import { MoviesService } from "src/movies/movies.service";

@Injectable()
export class ShowtimesService {
    constructor(
        @InjectRepository(Showtime)
        private showtimesRepository: Repository<Showtime>,
        private moviesService: MoviesService,
    ) {}

    async findOne(id: number): Promise<Showtime> {
        return this.showtimesRepository.findOneBy({ id });
    }

    async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
        const showtime = this.showtimesRepository.create(createShowtimeDto);
        const movie = await this.moviesService.findOne(createShowtimeDto.movieId);
        if (!movie) {
            throw new NotFoundException(`Movie with id ${createShowtimeDto.movieId} not found`);
        }

        const possibleConflicts = await this.showtimesRepository.find({
            where: [
                {
                theater: showtime.theater,
                start_time: Between(showtime.start_time,showtime.end_time)
                },
                {
                theater: showtime.theater,
                end_time: Between(showtime.start_time,showtime.end_time)
                }
            ]
        }); 
        if (possibleConflicts.length > 0) {
            throw new BadRequestException('Showtime conflicts with existing showtimes');
        }
        return this.showtimesRepository.save(showtime); 
    }

    async findAll(): Promise<Showtime[]> {
        return this.showtimesRepository.find();
    }
}