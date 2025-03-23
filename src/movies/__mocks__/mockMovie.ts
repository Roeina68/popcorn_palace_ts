// src/movies/__mocks__/mockMovie.ts

export const mockMovie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    release_year: 2010,
    rating: 8.8,
  };
  
  export const mockMovieAlt = {
    id: 2,
    title: 'The Matrix',
    genre: 'Action',
    duration: 136,
    release_year: 1999,
    rating: 8.7,
  };
  
  export const mockMovieList = [mockMovie, mockMovieAlt];
  
  /**
   * ID that doesn’t exist in mockMovieList
   * Used for “not found” tests
   */
  export const mockMovieInvalidId = 999;
  
  /**
   * Duplicate title scenario for testing creation constraints
   */
  export const mockMovieWithDuplicateTitle = {
    id: 3,
    title: 'Inception', // Same as existing movie
    genre: 'Thriller',
    duration: 100,
    releaseYear: 2015,
    rating: 7.2,
  };
  
  /**
   * Edge-case: Empty DB
   */
  export const mockEmptyMovieList: any[] = [];
  
  /**
   * Invalid data for DTO-level validation tests
   * Use when directly calling create() or update() in controller
   */
  export const mockMoviePartial = {
    title: '',              // Should trigger IsNotEmpty / MinLength
    genre: '',
    duration: -10,          // Invalid: < Min(1)
    release_year: 1800,     // Invalid: < Min(1900)
    rating: 15              // Invalid: > Max(10)
  };
  