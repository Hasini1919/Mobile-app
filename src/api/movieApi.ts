import axios from 'axios';
import { Movie } from '../types/movie';

const API_KEY = '7c3b76f41174c9e954312de1fccf151b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface MovieResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

export const movieApi = {
  /**
   * Get trending movies
   */
  getTrendingMovies: async (): Promise<Movie[]> => {
    try {
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
      );
      return response.data.results.map(transformMovie);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  /**
   * Get popular movies
   */
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
      );
      return {
        ...response.data,
        results: response.data.results.map(transformMovie),
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  /**
   * Get top rated movies
   */
  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
      );
      return {
        ...response.data,
        results: response.data.results.map(transformMovie),
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  /**
   * Get upcoming movies
   */
  getUpcomingMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`
      );
      return {
        ...response.data,
        results: response.data.results.map(transformMovie),
      };
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  /**
   * Search movies
   */
  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      );
      return {
        ...response.data,
        results: response.data.results.map(transformMovie),
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  /**
   * Get movie details by ID
   */
  getMovieDetails: async (movieId: number): Promise<Movie> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      return transformMovieDetails(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  /**
   * Get movie by ID (alias for getMovieDetails)
   */
  getMovieById: async (movieId: number): Promise<Movie> => {
    return movieApi.getMovieDetails(movieId);
  },

  /**
   * Get all movies (popular movies for general listing)
   */
  getAllMovies: async (page: number = 1): Promise<Movie[]> => {
    try {
      const response = await movieApi.getPopularMovies(page);
      return response.results;
    } catch (error) {
      console.error('Error fetching all movies:', error);
      throw error;
    }
  },

  /**
   * Get movie genres
   */
  getGenres: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
      );
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  /**
   * Discover movies by genre
   */
  discoverByGenre: async (genreId: number, page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axios.get<MovieResponse>(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
      );
      return {
        ...response.data,
        results: response.data.results.map(transformMovie),
      };
    } catch (error) {
      console.error('Error discovering movies by genre:', error);
      throw error;
    }
  },
};

/**
 * Transform API movie data to app Movie type
 */
function transformMovie(apiMovie: any): Movie {
  return {
    id: apiMovie.id,
    title: apiMovie.title,
    overview: apiMovie.overview,
    posterPath: apiMovie.poster_path ? `${IMAGE_BASE_URL}${apiMovie.poster_path}` : '',
    backdropPath: apiMovie.backdrop_path ? `${IMAGE_BASE_URL}${apiMovie.backdrop_path}` : '',
    releaseDate: apiMovie.release_date || '',
    voteAverage: apiMovie.vote_average || 0,
    voteCount: apiMovie.vote_count || 0,
    popularity: apiMovie.popularity || 0,
    genreIds: apiMovie.genre_ids || [],
    originalLanguage: apiMovie.original_language || 'en',
    adult: apiMovie.adult || false,
  };
}

/**
 * Transform detailed movie data
 */
function transformMovieDetails(apiMovie: any): Movie {
  return {
    id: apiMovie.id,
    title: apiMovie.title,
    overview: apiMovie.overview,
    posterPath: apiMovie.poster_path ? `${IMAGE_BASE_URL}${apiMovie.poster_path}` : '',
    backdropPath: apiMovie.backdrop_path ? `${IMAGE_BASE_URL}${apiMovie.backdrop_path}` : '',
    releaseDate: apiMovie.release_date || '',
    voteAverage: apiMovie.vote_average || 0,
    voteCount: apiMovie.vote_count || 0,
    popularity: apiMovie.popularity || 0,
    genreIds: apiMovie.genres ? apiMovie.genres.map((g: any) => g.id) : [],
    originalLanguage: apiMovie.original_language || 'en',
    adult: apiMovie.adult || false,
    runtime: apiMovie.runtime,
    budget: apiMovie.budget,
    revenue: apiMovie.revenue,
    genres: apiMovie.genres,
    productionCompanies: apiMovie.production_companies,
    cast: apiMovie.credits?.cast?.slice(0, 10),
    videos: apiMovie.videos?.results,
  };
}
