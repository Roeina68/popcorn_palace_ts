import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShowtimesService } from "./showtimes.service";
import { ShowtimesController } from "./showtimes.controller";
import { Showtime } from "./entities/showtime.entity";
import { MoviesModule } from '../movies/movies.module'; // <-- 👈 Import the module


@Module({
    imports: [TypeOrmModule.forFeature([Showtime]),
    MoviesModule
    ],
    controllers: [ShowtimesController],
    providers: [ShowtimesService],
    exports: [ShowtimesService],
})
export class ShowtimesModule {} 
