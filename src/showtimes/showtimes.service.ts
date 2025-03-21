import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Showtime } from "./entities/showtime.entity";
import { CreateShowtimeDto } from "./dtos/create-showtime.dto";
@Injectable()
export class ShowtimesService {
    constructor(
        @InjectRepository(Showtime)
        private showtimesRepository: Repository<Showtime>,
    ) {}

    async findOne(id: number): Promise<Showtime> {
        return this.showtimesRepository.findOneBy({ id });
    }

    async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
        const showtime = this.showtimesRepository.create(createShowtimeDto);
        return this.showtimesRepository.save(showtime); 
    }

    async findAll(): Promise<Showtime[]> {
        return this.showtimesRepository.find();
    }
}