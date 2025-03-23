import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { LoggerService } from '../../common/services/logger.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    releaseYear: 2010,
    rating: 8.8,
    showtimes: [],
  };

  const createDto: CreateMovieDto = {
    title: 'Interstellar',
    genre: 'Sci-Fi',
    duration: 169,
    releaseYear: 2014,
    rating: 8.6,
  };

  const updateDto: UpdateMovieDto = {
    title: 'Inception 2',
    genre: 'Action',
    duration: 150,
    releaseYear: 2025,
    rating: 9,
  };

  const mockRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepo,
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a new movie if title is unique', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(null);
      mockRepo.create.mockReturnValueOnce(createDto);
      mockRepo.save.mockResolvedValueOnce({ id: 2, ...createDto, release_year: createDto.releaseYear });

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining({ title: createDto.title }));
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if movie title already exists', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(mockMovie);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('should catch and rethrow PostgreSQL unique constraint error', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(null);
      mockRepo.create.mockReturnValueOnce(createDto);
      mockRepo.save.mockRejectedValueOnce({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      mockRepo.find.mockResolvedValueOnce([mockMovie]);
      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('findOne', () => {
    it('should return movie by ID', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(mockMovie);
      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findOneByTitle', () => {
    it('should decode title and return movie', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(mockMovie);
      const result = await service.findOneByTitle('Inception%20Test');
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ title: 'Inception Test' });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    it('should update movie by title', async () => {
      mockRepo.findOneBy
        .mockResolvedValueOnce(mockMovie) // from findOneByTitle
        .mockResolvedValueOnce({ ...mockMovie, ...updateDto }); // after update

      const result = await service.update('Inception', updateDto);

      expect(mockRepo.update).toHaveBeenCalledWith(mockMovie.id, updateDto);
      expect(result.title).toBe(updateDto.title);
    });

    it('should throw NotFoundException if movie not found for update', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.update('Unknown', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete movie by title', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(mockMovie);
      mockRepo.delete.mockResolvedValueOnce(undefined);

      await expect(service.remove('Inception')).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledWith(mockMovie.id);
    });

    it('should throw NotFoundException if movie not found for delete', async () => {
      mockRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.remove('Unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
