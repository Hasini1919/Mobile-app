import AsyncStorage from '@react-native-async-storage/async-storage';

const RATINGS_KEY = '@streambox_ratings';

export interface MovieRating {
  movieId: number;
  rating: number; // 1-5 stars
  ratedAt: string;
}

export const ratingsStorage = {
  /**
   * Get all user ratings
   */
  getAllRatings: async (): Promise<MovieRating[]> => {
    try {
      const ratingsData = await AsyncStorage.getItem(RATINGS_KEY);
      return ratingsData ? JSON.parse(ratingsData) : [];
    } catch (error) {
      console.error('Error getting ratings:', error);
      return [];
    }
  },

  /**
   * Get rating for a specific movie
   */
  getMovieRating: async (movieId: number): Promise<number | null> => {
    try {
      const ratings = await ratingsStorage.getAllRatings();
      const movieRating = ratings.find((r) => r.movieId === movieId);
      return movieRating ? movieRating.rating : null;
    } catch (error) {
      console.error('Error getting movie rating:', error);
      return null;
    }
  },

  /**
   * Rate a movie
   */
  rateMovie: async (movieId: number, rating: number): Promise<void> => {
    try {
      const ratings = await ratingsStorage.getAllRatings();
      const existingIndex = ratings.findIndex((r) => r.movieId === movieId);

      const newRating: MovieRating = {
        movieId,
        rating,
        ratedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        // Update existing rating
        ratings[existingIndex] = newRating;
      } else {
        // Add new rating
        ratings.push(newRating);
      }

      await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch (error) {
      console.error('Error rating movie:', error);
      throw new Error('Failed to rate movie');
    }
  },

  /**
   * Remove rating for a movie
   */
  removeRating: async (movieId: number): Promise<void> => {
    try {
      const ratings = await ratingsStorage.getAllRatings();
      const filtered = ratings.filter((r) => r.movieId !== movieId);
      await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing rating:', error);
      throw new Error('Failed to remove rating');
    }
  },

  /**
   * Clear all ratings
   */
  clearRatings: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(RATINGS_KEY);
    } catch (error) {
      console.error('Error clearing ratings:', error);
      throw new Error('Failed to clear ratings');
    }
  },
};
