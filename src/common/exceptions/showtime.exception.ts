import { HttpException, HttpStatus } from '@nestjs/common';

export class ShowtimeNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Showtime with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ShowtimeAlreadyExistsException extends HttpException {
  constructor(movieId: string, startTime: string) {
    super(`Showtime for movie ${movieId} at ${startTime} already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidShowtimeDataException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ShowtimeOverlapException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ShowtimeInPastException extends HttpException {
  constructor(startTime: string) {
    super(`Cannot create showtime in the past: ${startTime}`, HttpStatus.BAD_REQUEST);
  }
} 