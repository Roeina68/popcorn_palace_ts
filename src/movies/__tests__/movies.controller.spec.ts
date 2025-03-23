import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { mockMoviesService } from '../__mocks__/movies.service.mock';
import {
  mockMovie,
  mockMovieList,
  mockMovieWithDuplicateTitle,
} from '../__mocks__/mockMovie';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      mockMoviesService.findAll.mockResolvedValueOnce(mockMovieList);
      const result = await controller.findAll();
      expect(result).toEqual(mockMovieList);
    });
  });

  describe('findOne', () => {
    it('should return movie by ID', async () => {
      mockMoviesService.findOne.mockResolvedValueOnce(mockMovie);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesService.findOne.mockRejectedValueOnce(
        new NotFoundException('Movie not found'),
      );
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const dto: CreateMovieDto = {
      title: 'New Movie',
      genre: 'Adventure',
      duration: 120,
      releaseYear: 2024,
      rating: 7.5,
    };

    it('should create and return the movie', async () => {
      mockMoviesService.create.mockResolvedValueOnce({ id: 3, ...dto });
      const result = await controller.create(dto);
      expect(result).toEqual({ id: 3, ...dto });
    });

    it('should throw ConflictException if title already exists', async () => {
      mockMoviesService.create.mockRejectedValueOnce(
        new ConflictException('Movie title already exists'),
      );
      await expect(controller.create(mockMovieWithDuplicateTitle)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    const dto: UpdateMovieDto = {
      title: 'Updated Movie',
      genre: 'Drama',
      duration: 100,
      releaseYear: 2023,
      rating: 8,
    };

    it('should update the movie by title', async () => {
      mockMoviesService.update.mockResolvedValueOnce({ id: 1, ...dto });
      const result = await controller.update('Inception', dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesService.update.mockRejectedValueOnce(
        new NotFoundException('Movie not found'),
      );
      await expect(controller.update('Ghost Movie', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove movie by title', async () => {
      mockMoviesService.remove.mockResolvedValueOnce(undefined);
      const result = await controller.remove('Inception');
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesService.remove.mockRejectedValueOnce(
        new NotFoundException('Movie not found'),
      );
      await expect(controller.remove('Nonexistent Movie')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
