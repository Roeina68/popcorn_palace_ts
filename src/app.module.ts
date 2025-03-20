import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movie/movies.module';
import { Movie } from './movie/movie.model';
import { MoviesController } from './movie/movies.controller';
import { MoviesService } from './movie/movies.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'popcorn-palace',
      entities: [Movie],
      synchronize: true, // Set to false in production
    }),
    MoviesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
