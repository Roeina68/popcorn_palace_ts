import { Showtime } from '../entities/showtime.entity';

export const mockShowtime: Showtime = {
  id: 1,
  movieId: 1,
  theater: 'Sample Theater',
  startTime: new Date('2025-02-14T11:47:46.125Z'),
  endTime: new Date('2025-02-14T14:47:46.125Z'),
  price: 20.2,
  movie: {
    id: 1,
    title: 'The Matrix',
    genre: 'Sci-Fi',
    duration: 136,
    releaseYear: 1999,
    rating: 8.7,
    showtimes: [],
  },
};

export const mockShowtimeArray: Showtime[] = [mockShowtime];
