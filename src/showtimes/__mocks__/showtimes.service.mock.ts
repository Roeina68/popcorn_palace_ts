import { mockShowtime } from './mockShowtime';

export const mockShowtimesService = {
  findOne: jest.fn().mockResolvedValue(mockShowtime),

  findAll: jest.fn().mockResolvedValue([mockShowtime]),

  create: jest.fn().mockImplementation((dto) => ({
    ...dto,
    id: 2,
    startTime: dto.startTime,
    endTime: dto.endTime,
    movie: mockShowtime.movie,
  })),

  update: jest.fn().mockImplementation((id, dto) => ({
    id,
    ...dto,
    startTime: dto.startTime,
    endTime: dto.endTime,
    movie: mockShowtime.movie,
  })),

  remove: jest.fn().mockResolvedValue(undefined),
};
