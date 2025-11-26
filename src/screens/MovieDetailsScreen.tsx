import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import { Movie } from '../types/movie';
import { movieApi } from '../api/movieApi';
import { favoritesStorage } from '../storage/favoritesStorage';
import { ratingsStorage } from '../storage/ratingsStorage';

const { width } = Dimensions.get('window');

type RouteParams = {
  MovieDetails: {
    movieId: number;
  };
};

export default function MovieDetailsScreen() {
  const { theme: colors } = useTheme();
  const route = useRoute<RouteProp<RouteParams, 'MovieDetails'>>();
  const navigation = useNavigation();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    loadMovieDetails();
  }, [route.params?.movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const movieData = await movieApi.getMovieById(route.params.movieId);
      if (movieData) {
        setMovie(movieData);
        const favStatus = await favoritesStorage.isFavorite(movieData.id);
        setIsFavorite(favStatus);
        const rating = await ratingsStorage.getMovieRating(movieData.id);
        setUserRating(rating);
      }
    } catch (error) {
      console.error('Error loading movie details:', error);
      Alert.alert('Error', 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!movie) return;
    try {
      const newStatus = await favoritesStorage.toggleFavorite(movie.id);
      setIsFavorite(newStatus);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleRating = async (rating: number) => {
    if (!movie) return;
    try {
      await ratingsStorage.rateMovie(movie.id, rating);
      setUserRating(rating);
      Alert.alert('Success', `You rated ${movie.title} ${rating} stars!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to rate movie');
    }
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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 20,
    },
    errorText: {
      fontSize: 20,
      color: colors.text,
      marginTop: 16,
      marginBottom: 24,
    },
    backButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    backButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    header: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      zIndex: 10,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    posterContainer: {
      width: '100%',
      aspectRatio: 2/3,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    poster: {
      width: '100%',
      height: '100%',
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    year: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    duration: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    language: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textSecondary,
      marginHorizontal: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    tmdbRating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 16,
      gap: 8,
      shadowColor: '#000', // Changed from colors.shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    ratingText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    ratingLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    yourRatingSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    starButton: {
      padding: 4,
    },
    starFilled: {},
    yourRatingText: {
      fontSize: 14,
      color: colors.accent,
      marginTop: 8,
    },
    genresSection: {
      marginBottom: 24,
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    genreChip: {
      backgroundColor: colors.card,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 20,
      shadowColor: '#000', // Changed from colors.shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    genreText: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '600',
    },
    section: {
      marginBottom: 24,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    infoText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    castText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <CustomText style={styles.loadingText}>Loading movie details...</CustomText>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={64} color={colors.error} />
        <CustomText style={styles.errorText}>Movie not found</CustomText>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <CustomText style={styles.backButtonText}>Go Back</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleFavoriteToggle}>
          <Feather name="heart" size={24} color={isFavorite ? colors.accent : colors.text} />
        </TouchableOpacity>
      </View>

      {/* Poster Image */}
      <View style={styles.posterContainer}>
        <Image 
          source={{ 
            uri: movie.posterPath 
              ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` 
              : movie.poster || 'https://via.placeholder.com/500x750/3d3d3d/ffffff?text=No+Poster'
          }} 
          style={styles.poster}
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
        />
      </View>

      {/* Movie Details */}
      <View style={styles.content}>
        {/* Title and Year */}
        <CustomText style={styles.title}>{movie.title}</CustomText>
        <View style={styles.metaRow}>
          <CustomText style={styles.year}>{movie.releaseYear}</CustomText>
          <View style={styles.dot} />
          <CustomText style={styles.duration}>{movie.duration} min</CustomText>
          <View style={styles.dot} />
          <CustomText style={styles.language}>{movie.language}</CustomText>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.tmdbRating}>
            <Feather name="star" size={20} color={colors.primary} />
            <CustomText style={styles.ratingText}>
              {movie.voteAverage ? movie.voteAverage.toFixed(1) : '0.0'}/10
            </CustomText>
            <CustomText style={styles.ratingLabel}>TMDB Rating</CustomText>
          </View>
        </View>

        {/* Your Rating */}
        <View style={styles.yourRatingSection}>
          <CustomText style={styles.sectionTitle}>Your Rating</CustomText>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starButton}
              >
                <Feather
                  name="star"
                  size={32}
                  color={userRating && star <= userRating ? colors.accent : colors.textSecondary}
                  style={userRating && star <= userRating ? styles.starFilled : undefined}
                />
              </TouchableOpacity>
            ))}
          </View>
          {userRating && (
            <CustomText style={styles.yourRatingText}>
              You rated this {userRating} star{userRating !== 1 ? 's' : ''}
            </CustomText>
          )}
        </View>

        {/* Genres */}
        <View style={styles.genresSection}>
          <CustomText style={styles.sectionTitle}>Genres</CustomText>
          <View style={styles.genresContainer}>
            {movie.genres?.map((genre: any, index) => (
              <View key={index} style={styles.genreChip}>
                <CustomText style={styles.genreText}>
                  {typeof genre === 'string' ? genre : genre?.name || 'Unknown'}
                </CustomText>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Overview</CustomText>
          <CustomText style={styles.description}>
            {movie.overview || movie.description || 'No overview available.'}
          </CustomText>
        </View>

        {/* Director */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Director</CustomText>
          <CustomText style={styles.infoText}>{movie.director}</CustomText>
        </View>

        {/* Cast */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Cast</CustomText>
          {movie.cast?.map((actor: any, index) => (
            <CustomText key={index} style={styles.castText}>
              • {typeof actor === 'string' ? actor : actor?.name || 'Unknown'}
            </CustomText>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
