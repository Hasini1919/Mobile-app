import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from '../components/CustomText';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ratingsStorage, MovieRating } from '../storage/ratingsStorage';
import { movieApi } from '../api/movieApi';
import { Movie } from '../types/movie';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SortOption = 'recent' | 'highRated' | 'lowRated';

interface RatedMovie {
  movie: Movie;
  rating: MovieRating;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function RatedMoviesScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<RatedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    loadRatedMovies();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRatedMovies();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [ratedMovies, searchQuery, sortBy]);

  const loadRatedMovies = async () => {
    try {
      const ratings = await ratingsStorage.getAllRatings();
      const moviesWithRatings: RatedMovie[] = [];

      for (const rating of ratings) {
        const movie = await movieApi.getMovieById(rating.movieId);
        if (movie) {
          moviesWithRatings.push({ movie, rating });
        }
      }

      setRatedMovies(moviesWithRatings);
    } catch (error) {
      console.error('Error loading rated movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...ratedMovies];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(({ movie }) =>
        movie.title.toLowerCase().includes(query) ||
        movie.genres?.some(genre => genre.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'highRated':
        filtered.sort((a, b) => b.rating.rating - a.rating.rating);
        break;
      case 'lowRated':
        filtered.sort((a, b) => a.rating.rating - b.rating.rating);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) =>
          new Date(b.rating.ratedAt).getTime() - new Date(a.rating.ratedAt).getTime()
        );
        break;
    }

    setFilteredMovies(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRatedMovies();
  };

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetails', { movieId });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'highRated':
        return 'High Rated';
      case 'lowRated':
        return 'Low Rated';
      case 'recent':
      default:
        return 'Recent';
    }
  };

  const cycleSortOption = () => {
    const options: SortOption[] = ['recent', 'highRated', 'lowRated'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Feather
            key={star}
            name="star"
            size={16}
            color={star <= rating ? '#FFD700' : colors.border}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    countBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    countText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: 'bold',
    },
    controlsContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
      gap: 12,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      gap: 8,
    },
    sortButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    moviesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    movieItemContainer: {
      width: CARD_WIDTH,
      marginBottom: 16,
    },
    ratingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      gap: 6,
    },
    starsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
    },
    ratingDate: {
      fontSize: 10,
      color: colors.textSecondary,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Rated Movies</CustomText>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  const renderEmptyState = () => {
    if (ratedMovies.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather 
            name="star" 
            size={80} 
            color={colors.textSecondary} 
            style={styles.emptyIcon}
          />
          <CustomText style={styles.emptyTitle}>No Rated Movies</CustomText>
          <CustomText style={styles.emptyText}>
            You haven't rated any movies yet. Start rating movies to see them here!
          </CustomText>
        </View>
      );
    }

    if (filteredMovies.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather 
            name="search" 
            size={80} 
            color={colors.textSecondary} 
            style={styles.emptyIcon}
          />
          <CustomText style={styles.emptyTitle}>No Results Found</CustomText>
          <CustomText style={styles.emptyText}>
            No movies match your search. Try a different search term.
          </CustomText>
        </View>
      );
    }

    return null;
  };

  if (ratedMovies.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Rated Movies</CustomText>
        </View>
        {renderEmptyState()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Rated Movies</CustomText>
        <View style={styles.countBadge}>
          <CustomText style={styles.countText}>{filteredMovies.length}</CustomText>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search rated movies..."
          onClear={handleClearSearch}
        />
        <TouchableOpacity style={styles.sortButton} onPress={cycleSortOption}>
          <Feather name="filter" size={18} color={colors.primary} />
          <CustomText style={styles.sortButtonText}>Sort: {getSortLabel()}</CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {filteredMovies.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.moviesGrid}>
            {filteredMovies.map(({ movie, rating }) => (
              <View key={movie.id} style={styles.movieItemContainer}>
                <MovieCard
                  movie={movie}
                  onPress={() => handleMoviePress(movie.id)}
                />
                <View style={styles.ratingInfo}>
                  {renderStars(rating.rating)}
                  <CustomText style={styles.ratingText}>
                    {rating.rating}/5
                  </CustomText>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
