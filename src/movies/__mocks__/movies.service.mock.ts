// src/movies/__mocks__/movies.service.mock.ts

import { mockMovie, mockMovieList } from './mockMovie';

export const mockMoviesService = {
  findAll: jest.fn().mockResolvedValue(mockMovieList),
  findOne: jest.fn().mockImplementation((id: number) =>
    Promise.resolve(mockMovieList.find(movie => movie.id === id))
  ),
  create: jest.fn().mockImplementation((dto) =>
    Promise.resolve({ id: Date.now(), ...dto })
  ),
  update: jest.fn().mockImplementation((id, dto) =>
    Promise.resolve({ id, ...dto })
  ),
  remove: jest.fn().mockResolvedValue(undefined),
};
