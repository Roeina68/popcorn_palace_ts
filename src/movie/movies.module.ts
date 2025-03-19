import { Module } from "@nestjs/common";

import { MoviesService } from "./movies.service";
import { MoviesController } from "./movies.controller";
import { Movie } from "./movie.model";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],
    controllers: [MoviesController],
    providers: [MoviesService],

})
export class MoviesModule {}
