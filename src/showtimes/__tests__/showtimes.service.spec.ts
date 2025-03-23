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
import { LoggerService } from '../../common/services/logger.service';
import {
    ShowtimeNotFoundException,
    InvalidShowtimeDataException,
    ShowtimeOverlapException,
    ShowtimeInPastException
} from '../../common/exceptions/showtime.exception';

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

    it('should throw ShowtimeNotFoundException if showtime not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(ShowtimeNotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new showtime', async () => {
      const dto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Test Theater',
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 90000000), // Tomorrow + 1 hour
        price: 15,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw InvalidShowtimeDataException if movie is missing', async () => {
      jest.spyOn(mockMoviesService, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create({ ...mockShowtime, movieId: 999 })).rejects.toThrow(InvalidShowtimeDataException);
    });

    it('should throw ShowtimeOverlapException if showtime overlaps', async () => {
      mockShowtimesRepo.createQueryBuilder().getMany.mockResolvedValueOnce([mockShowtime]);

      await expect(service.create({
        ...mockShowtime,
        movieId: 1,
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 90000000),
      })).rejects.toThrow(ShowtimeOverlapException);
    });

    it('should throw ShowtimeInPastException if start time is in the past', async () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      await expect(service.create({
        ...mockShowtime,
        movieId: 1,
        startTime: pastDate,
        endTime: new Date(Date.now() + 3600000),
      })).rejects.toThrow(ShowtimeInPastException);
    });
  });

  describe('update', () => {
    it('should update and return a showtime', async () => {
      const dto: UpdateShowtimeDto = {
        movieId: 1,
        theater: 'Updated',
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 90000000),
        price: 22,
      };

      const result = await service.update(mockShowtime.id, dto);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw ShowtimeNotFoundException if showtime is missing', async () => {
      mockShowtimesRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(ShowtimeNotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a showtime by ID', async () => {
      await service.remove(mockShowtime.id);
      expect(mockShowtimesRepo.delete).toHaveBeenCalledWith(mockShowtime.id);
    });

    it('should throw ShowtimeNotFoundException if showtime is missing', async () => {
      mockShowtimesRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(ShowtimeNotFoundException);
    });
  });
});
