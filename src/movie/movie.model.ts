export class Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  release_year: number;
  rating: number;

  constructor(id: string, title: string, genre: string, duration: number, release_year: number, rating: number) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.duration = duration;
    this.release_year = release_year;
    this.rating = rating;
  }
}

