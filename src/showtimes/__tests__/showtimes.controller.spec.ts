import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from '../showtimes.controller';
import { ShowtimesService } from '../showtimes.service';
import { mockShowtime, mockShowtimeArray } from '../__mocks__/mockShowtime';
import { CreateShowtimeDto } from '../dtos/create-showtime.dto';
import { UpdateShowtimeDto } from '../dtos/update-showtime.dto';
import { NotFoundException } from '@nestjs/common';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockShowtimeArray),
    findOne: jest.fn().mockResolvedValue(mockShowtime),
    create: jest.fn().mockResolvedValue(mockShowtime),
    update: jest.fn().mockResolvedValue({ ...mockShowtime, theater: 'Updated Theater' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [{ provide: ShowtimesService, useValue: mockService }],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllShowtimes', () => {
    it('should return all showtimes', async () => {
      const result = await controller.getAllShowtimes();
      expect(result).toEqual(mockShowtimeArray);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getShowtimeByID', () => {
    it('should return a single showtime by id', async () => {
      const result = await controller.getShowtimeByID(1);
      expect(result).toEqual(mockShowtime);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when showtime not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      await expect(controller.getShowtimeByID(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createShowtime', () => {
    it('should create a new showtime', async () => {
      const dto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Test Theater',
        startTime: new Date(),
        endTime: new Date(),
        price: 15.5,
      };

      const result = await controller.createShowtime(dto);
      expect(result).toEqual(mockShowtime);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a showtime by id', async () => {
      const dto: UpdateShowtimeDto = {
        movieId: 1,
        theater: 'Updated Theater',
        startTime: new Date(),
        endTime: new Date(),
        price: 20,
      };

      const result = await controller.update(1, dto);
      expect(result.theater).toBe('Updated Theater');
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a showtime by id', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
