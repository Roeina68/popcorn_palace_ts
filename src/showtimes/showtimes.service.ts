import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Showtime } from "./entities/showtime.entity";
import { CreateShowtimeDto } from "./dtos/create-showtime.dto";
import { UpdateShowtimeDto } from "./dtos/update-showtime.dto";
import { MoviesService } from "../movies/movies.service";
import { LoggerService } from "../common/services/logger.service";
import {
    ShowtimeNotFoundException,
    ShowtimeAlreadyExistsException,
    InvalidShowtimeDataException,
    ShowtimeOverlapException,
    ShowtimeInPastException
} from "../common/exceptions/showtime.exception";

@Injectable()
export class ShowtimesService {
    constructor(
        @InjectRepository(Showtime)
        private showtimesRepository: Repository<Showtime>,
        private moviesService: MoviesService,
        private readonly logger: LoggerService,
    ) {}

    async findOne(id: number): Promise<Showtime> {
        const showtime = await this.showtimesRepository.findOneBy({ id });
        if (!showtime) {
            this.logger.error(`Showtime not found with ID: ${id}`, null, 'ShowtimesService');
            throw new ShowtimeNotFoundException(id.toString());
        }
        this.logger.log(`Retrieved showtime: ${showtime.id}`, 'ShowtimesService');
        return showtime;
    }

    async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
        const movie = await this.moviesService.findOne(createShowtimeDto.movieId);
        if (!movie) {
            this.logger.error(`Showtime creation failed: Movie with id ${createShowtimeDto.movieId} not found`, null, 'ShowtimesService');
            throw new InvalidShowtimeDataException(`Movie with id ${createShowtimeDto.movieId} not found`);
        }

        // Check if showtime is in the past
        const startTime = new Date(createShowtimeDto.startTime);
        if (startTime < new Date()) {
            this.logger.error(`Showtime creation failed: Start time ${startTime} is in the past`, null, 'ShowtimesService');
            throw new ShowtimeInPastException(startTime.toISOString());
        }
      
        const showtime = this.showtimesRepository.create({
            ...createShowtimeDto,
            movie,
        });
      
        const conflictingShowtimes = await this.showtimesRepository
            .createQueryBuilder('showtime')
            .where('showtime.theater = :theater', { theater: showtime.theater })
            .andWhere('showtime.start_time <= :newEnd', { newEnd: showtime.endTime })
            .andWhere('showtime.end_time >= :newStart', { newStart: showtime.startTime })
            .getMany();
      
        if (conflictingShowtimes.length > 0) {
            this.logger.error(`Showtime creation failed: Time conflict in theater ${showtime.theater}`, null, 'ShowtimesService');
            throw new ShowtimeOverlapException(`Showtime conflicts with existing showtimes in theater ${showtime.theater}`);
        }
      
        try {
            const savedShowtime = await this.showtimesRepository.save(showtime);
            this.logger.log(`Showtime created successfully: ${savedShowtime.id} for movie ${movie.title}`, 'ShowtimesService');
            return savedShowtime;
        } catch (error) {
            this.logger.error(`Showtime creation failed: ${error.message}`, error.stack, 'ShowtimesService');
            throw new InvalidShowtimeDataException("Showtime creation failed");
        }
    }

    async findAll(): Promise<Showtime[]> {
        const showtimes = await this.showtimesRepository.find();
        this.logger.log(`Retrieved ${showtimes.length} showtimes`, 'ShowtimesService');
        return showtimes;
    }

    async update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime> {
        const showtime = await this.findOne(id);
        if (!showtime) {
            this.logger.error(`Showtime update failed: Showtime with id ${id} not found`, null, 'ShowtimesService');
            throw new ShowtimeNotFoundException(id.toString());
        }

        try {
            await this.showtimesRepository.update(showtime.id, updateShowtimeDto);
            const updatedShowtime = await this.showtimesRepository.findOneBy({ id: showtime.id });
            this.logger.log(`Showtime updated successfully: ${updatedShowtime.id}`, 'ShowtimesService');
            return updatedShowtime;
        } catch (error) {
            this.logger.error(`Showtime update failed: ${error.message}`, error.stack, 'ShowtimesService');
            throw new InvalidShowtimeDataException("Showtime update failed");
        }
    }

    async remove(id: number): Promise<void> {
        const showtime = await this.findOne(id);
        if (!showtime) {
            this.logger.error(`Showtime removal failed: Showtime with id ${id} not found`, null, 'ShowtimesService');
            throw new ShowtimeNotFoundException(id.toString());
        }

        try {
            await this.showtimesRepository.delete(showtime.id);
            this.logger.log(`Showtime removed successfully: ${showtime.id}`, 'ShowtimesService');
        } catch (error) {
            this.logger.error(`Showtime removal failed: ${error.message}`, error.stack, 'ShowtimesService');
            throw new InvalidShowtimeDataException("Showtime removal failed");
        }
    }
}