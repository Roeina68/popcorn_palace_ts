import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Showtime } from "./entities/showtime.entity";
import { CreateShowtimeDto } from "./dtos/create-showtime.dto";
import { UpdateShowtimeDto } from "./dtos/update-showtime.dto";
import { MoviesService } from "../movies/movies.service";

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
        const movie = await this.moviesService.findOne(createShowtimeDto.movieId);
        if (!movie) {
          throw new NotFoundException(`Movie with id ${createShowtimeDto.movieId} not found`);
        }
      
        const showtime = this.showtimesRepository.create({
          ...createShowtimeDto,
          movie, // Explicitly assign relation
        });
      
        const conflictingShowtimes = await this.showtimesRepository
          .createQueryBuilder('showtime')
          .where('showtime.theater = :theater', { theater: showtime.theater })
          .andWhere('showtime.start_time <= :newEnd', { newEnd: showtime.endTime })
          .andWhere('showtime.end_time >= :newStart', { newStart: showtime.startTime })
          .getMany();
      
        if (conflictingShowtimes.length > 0) {
          throw new BadRequestException('Showtime conflicts with existing showtimes');
        }
      
        return this.showtimesRepository.save(showtime);
      }
      

    async findAll(): Promise<Showtime[]> {
        return this.showtimesRepository.find();
    }

    async update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime> {
        const showtime = await this.findOne(id);
        if (!showtime) {
            throw new NotFoundException(`Showtime with id ${id} not found`);
        }
        await this.showtimesRepository.update(showtime.id, updateShowtimeDto);
        return this.showtimesRepository.findOneBy({ id: showtime.id });
    }

    async remove(id: number): Promise<void> {
        const showtime = await this.findOne(id);
        if (!showtime) {
            throw new NotFoundException(`Showtime with id ${id} not found`);
        }
        await this.showtimesRepository.delete(showtime.id);
    }
}