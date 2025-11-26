import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteMovie } from '../types/movie';

const FAVORITES_KEY = '@streambox_favorites';

export const favoritesStorage = {
  /**
   * Get all favorite movie IDs
   */
  getFavorites: async (): Promise<number[]> => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
      if (!favoritesData) return [];
      
      const favorites: FavoriteMovie[] = JSON.parse(favoritesData);
      return favorites.map((fav) => fav.movieId);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  /**
   * Add a movie to favorites
   */
  addFavorite: async (movieId: number): Promise<boolean> => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites: FavoriteMovie[] = favoritesData ? JSON.parse(favoritesData) : [];

      // Check if already exists
      if (favorites.some((fav) => fav.movieId === movieId)) {
        return false;
      }

      // Add new favorite
      const newFavorite: FavoriteMovie = {
        movieId,
        addedAt: new Date().toISOString(),
      };
      favorites.push(newFavorite);

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw new Error('Failed to add favorite');
    }
  },

  /**
   * Remove a movie from favorites
   */
  removeFavorite: async (movieId: number): Promise<boolean> => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
      if (!favoritesData) return false;

      let favorites: FavoriteMovie[] = JSON.parse(favoritesData);
      const initialLength = favorites.length;
      
      favorites = favorites.filter((fav) => fav.movieId !== movieId);

      if (favorites.length === initialLength) {
        return false; // Movie wasn't in favorites
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new Error('Failed to remove favorite');
    }
  },

  /**
   * Check if a movie is in favorites
   */
  isFavorite: async (movieId: number): Promise<boolean> => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      return favorites.includes(movieId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (movieId: number): Promise<boolean> => {
    try {
      const isFav = await favoritesStorage.isFavorite(movieId);
      if (isFav) {
        await favoritesStorage.removeFavorite(movieId);
        return false;
      } else {
        await favoritesStorage.addFavorite(movieId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  /**
   * Clear all favorites
   */
  clearFavorites: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('Failed to clear favorites');
    }
  },
};
