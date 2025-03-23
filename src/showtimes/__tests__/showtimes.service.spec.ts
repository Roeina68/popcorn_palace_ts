import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from '../showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from '../entities/showtime.entity';
import { Repository } from 'typeorm';
import { MoviesService } from '../../movies/movies.service';
import { mockShowtime, mockShowtimeArray } from '../__mocks__/mockShowtime';
import { mockMoviesService } from '../../movies/__mocks__/movies.service.mock';
import { CreateShowtimeDto } from '../dtos/create-showtime.dto';
import { UpdateShowtimeDto } from '../dtos/update-showtime.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LoggerService } from '../../common/services/logger.service';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let repo: Repository<Showtime>;
  let moviesService: MoviesService;

  const mockShowtimesRepo = {
    create: jest.fn().mockReturnValue(mockShowtime),
    save: jest.fn().mockResolvedValue(mockShowtime),
    find: jest.fn().mockResolvedValue(mockShowtimeArray),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      return id === mockShowtime.id ? mockShowtime : null;
    }),
    delete: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: getRepositoryToken(Showtime), useValue: mockShowtimesRepo },
        { provide: MoviesService, useValue: mockMoviesService },
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

    service = module.get<ShowtimesService>(ShowtimesService);
    repo = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all showtimes', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockShowtimeArray);
    });
  });

  describe('findOne', () => {
    it('should return a showtime by ID', async () => {
      const result = await service.findOne(mockShowtime.id);
      expect(result).toEqual(mockShowtime);
    });

    it('should return null if showtime not found', async () => {
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new showtime', async () => {
      const dto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Test Theater',
        startTime: new Date(),
        endTime: new Date(),
        price: 15,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw NotFoundException if movie is missing', async () => {
      jest.spyOn(mockMoviesService, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create({ ...mockShowtime, movieId: 999 })).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if showtime overlaps', async () => {
      mockShowtimesRepo.createQueryBuilder().getMany.mockResolvedValueOnce([mockShowtime]);

      await expect(service.create({
        ...mockShowtime,
        movieId: 1,
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update and return a showtime', async () => {
      const dto: UpdateShowtimeDto = {
        movieId: 1,
        theater: 'Updated',
        startTime: new Date(),
        endTime: new Date(),
        price: 22,
      };

      const result = await service.update(mockShowtime.id, dto);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw NotFoundException if showtime is missing', async () => {
      mockShowtimesRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a showtime by ID', async () => {
      await service.remove(mockShowtime.id);
      expect(mockShowtimesRepo.delete).toHaveBeenCalledWith(mockShowtime.id);
    });

    it('should throw NotFoundException if showtime is missing', async () => {
      mockShowtimesRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
