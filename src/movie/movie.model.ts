import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  genre: string;
  @Column()
  duration: number;
  @Column()
  release_year: number;
  @Column('float')
  rating: number;
}

export class MovieDto {
  title: string;
  genre: string;
  duration: number;
  release_year: number;
  rating: number;
}
