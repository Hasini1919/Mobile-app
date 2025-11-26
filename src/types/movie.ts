export type Language = 'English' | 'Tamil' | 'Hindi' | 'Sinhala' | 'Malayalam' | 'Telugu' | 'Kannada' | 'Bengali' | 'Marathi' | 'Gujarati' | 'Punjabi' | 'Spanish' | 'French' | 'German' | 'Italian' | 'Japanese' | 'Korean' | 'Chinese' | 'Arabic' | 'Russian' | 'Portuguese' | 'Turkish' | 'Thai' | 'Vietnamese' | 'Indonesian' | 'Dutch' | 'Swedish' | 'Polish' | 'Greek' | 'Hebrew' | 'Persian';
export type Genre = 'Action' | 'Adventure' | 'Animation' | 'Biography' | 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Family' | 'Fantasy' | 'Film-Noir' | 'History' | 'Horror' | 'Music' | 'Musical' | 'Mystery' | 'Romance' | 'Sci-Fi' | 'Sport' | 'Superhero' | 'Thriller' | 'War' | 'Western';

export interface Movie {
  id: number;
  title: string;
  description?: string;
  overview?: string;
  poster?: string;
  posterPath?: string;
  backdropPath?: string;
  rating?: number;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  language?: Language;
  originalLanguage?: string;
  genres?: Genre[];
  genreIds?: number[];
  releaseYear?: number;
  releaseDate?: string;
  duration?: number; // in minutes
  runtime?: number;
  director?: string;
  cast?: any[];
  adult?: boolean;
  budget?: number;
  revenue?: number;
  productionCompanies?: any[];
  videos?: any[];
}

export interface MovieCategory {
  id: string;
  name: string;
  type: 'language' | 'genre';
  value: Language | Genre;
}

export interface FavoriteMovie {
  movieId: number;
  addedAt: string;
}
