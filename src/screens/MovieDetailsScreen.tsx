import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from '../components/CustomText';
import { Movie, Genre } from '../types/movie';
import { movieApi } from '../api/movieApi';
import { favoritesStorage } from '../storage/favoritesStorage';
import { ratingsStorage } from '../storage/ratingsStorage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const POSTER_HEIGHT = height * 0.6;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

type RootStackParamList = {
  MovieDetails: { movieId: number };
};

type MovieDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieWithCast extends Omit<Movie, 'genres'> {
  cast?: CastMember[];
  genres?: (string | Genre)[];
  release_date?: string;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
}

const MovieDetailsScreen: React.FC = () => {
  const { theme: colors } = useTheme();
  const route = useRoute<MovieDetailsRouteProp>();
  const navigation = useNavigation<MovieDetailsScreenNavigationProp>();
  const [movie, setMovie] = useState<MovieWithCast | null>(null);
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
    retryButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
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
    poster: {
      width: width,
      height: POSTER_HEIGHT,
      backgroundColor: colors.surface,
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
      shadowColor: '#000', 
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
    starFilled: {
      // Filled star
    },
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
      shadowColor: '#000',
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
        <ActivityIndicator size="large" color="#0000ff" />
        <CustomText style={styles.loadingText}>Loading movie details...</CustomText>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <CustomText style={styles.errorText}>Failed to load movie details</CustomText>
        <TouchableOpacity style={styles.retryButton} onPress={loadMovieDetails}>
          <CustomText style={styles.retryButtonText}>Retry</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  const getGenreName = (genre: string | Genre): string => {
    if (!genre) return '';
    if (typeof genre === 'string') return genre;
    // Type guard to check if genre is a Genre object with a name property
    if (typeof genre === 'object' && genre && 'name' in genre) {
      return (genre as { name: string }).name;
    }
    return String(genre);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>
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
      <Image source={{ uri: movie.poster_path }} style={styles.poster} resizeMode="cover" />

      {/* Movie Details */}
      <View style={styles.content}>
        {/* Title and Year */}
        <CustomText style={styles.title}>{movie.title}</CustomText>
        <View style={styles.metaRow}>
          <CustomText style={styles.year}>{movie.release_date?.split('-')[0]}</CustomText>
          <View style={styles.dot} />
          <CustomText style={styles.duration}>{movie.runtime} min</CustomText>
          <View style={styles.dot} />
          <CustomText style={styles.language}>{movie.originalLanguage || 'N/A'}</CustomText>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.tmdbRating}>
            <Feather name="star" size={20} color={colors.primary} />
            <CustomText style={styles.ratingText}>{movie.vote_average?.toFixed(1)}/10</CustomText>
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
                  name={userRating && star <= userRating ? 'star' : 'star'}
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
                <CustomText style={styles.genreText}>{getGenreName(genre)}</CustomText>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Overview</CustomText>
          <CustomText style={styles.description}>{movie.overview || movie.description || 'No overview available.'}</CustomText>
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
              • {actor?.name || actor || 'Unknown'}
            </CustomText>
          ))}
        </View>
      </View>
    </Animated.ScrollView>
  </View>
);
}
