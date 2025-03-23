import { HttpException, HttpStatus } from '@nestjs/common';

export class MovieNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Movie with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class MovieAlreadyExistsException extends HttpException {
  constructor(title: string) {
    super(`Movie with title "${title}" already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidMovieDataException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
} 