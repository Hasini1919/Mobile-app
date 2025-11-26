import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from '../components/CustomText';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { Movie } from '../types/movie';
import { favoritesStorage } from '../storage/favoritesStorage';
import { movieApi } from '../api/movieApi';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme: colors } = useTheme();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    filterMovies();
  }, [searchQuery, favoriteMovies]);

  const filterMovies = () => {
    if (!searchQuery.trim()) {
      setFilteredMovies(favoriteMovies);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = favoriteMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.cast?.some((actor) => actor.toLowerCase().includes(lowerQuery)) ||
        movie.genres?.some((genre) => genre.toLowerCase().includes(lowerQuery)) ||
        movie.director?.toLowerCase().includes(lowerQuery)
    );
    setFilteredMovies(filtered);
  };

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = await favoritesStorage.getFavorites();
      
      if (favoriteIds.length === 0) {
        setFavoriteMovies([]);
        setFilteredMovies([]);
        return;
      }

      // Fetch all movies and filter favorites
      const [allMovies, trending] = await Promise.all([
        movieApi.getAllMovies(),
        movieApi.getTrendingMovies()
      ]);
      const favorites = allMovies.filter((movie: Movie) => favoriteIds.includes(movie.id));
      setFavoriteMovies(favorites);
      setFilteredMovies(favorites);
      setTrendingMovies(trending);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite movies');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleFavoriteChange = (isFavorite: boolean) => {
    // Reload favorites when a movie is removed
    if (!isFavorite) {
      loadFavorites();
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all movies from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesStorage.clearFavorites();
              setFavoriteMovies([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 16,
      color: colors.textSecondary,
      fontSize: 16,
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.background,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchSection: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    countText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    clearAllText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    moviesList: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    row: {
      justifyContent: 'space-between',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
    emptyHint: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginTop: 24,
      gap: 8,
    },
    hintText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <CustomText style={styles.loadingText}>Loading favorites...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Feather name="heart" size={32} color={colors.primary} />
          <CustomText style={styles.headerTitle}>My Favorites</CustomText>
        </View>
        {favoriteMovies.length > 0 && (
          <View style={styles.headerActions}>
            <CustomText style={styles.countText}>
              {favoriteMovies.length} {favoriteMovies.length === 1 ? 'movie' : 'movies'}
            </CustomText>
            <TouchableOpacity onPress={handleClearAll}>
              <CustomText style={styles.clearAllText}>Clear All</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Search Bar */}
      {favoriteMovies.length > 0 && (
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>
      )}

      {/* Favorites List */}
      {favoriteMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color={colors.border} />
          <CustomText style={styles.emptyText}>No favorites yet</CustomText>
          <CustomText style={styles.emptySubtext}>
            Add movies to your favorites to see them here
          </CustomText>
          <View style={styles.emptyHint}>
            <Feather name="info" size={16} color={colors.textSecondary} />
            <CustomText style={styles.hintText}>
              Tap the heart icon on any movie card to add it to favorites
            </CustomText>
          </View>
        </View>
      ) : filteredMovies.length === 0 && searchQuery.trim() ? (
        <View style={styles.emptyContainer}>
          <Feather name="search" size={64} color={colors.border} />
          <CustomText style={styles.emptyText}>No results found</CustomText>
          <CustomText style={styles.emptySubtext}>
            Try adjusting your search query
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          renderItem={({ item }) => (
            <MovieCard 
              movie={item} 
              onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
              onFavoriteChange={handleFavoriteChange}
              isTrending={trendingMovies.some(tm => tm.id === item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.moviesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}
