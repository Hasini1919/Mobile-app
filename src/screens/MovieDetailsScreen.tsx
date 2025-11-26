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
  ImageBackground,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Movie, Genre } from '../types/movie';

type RootStackParamList = {
  MovieDetails: { movieId: number };
  // Add other screen params as needed
};

type MovieDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieWithCast extends Movie {
  cast?: CastMember[];
  poster_path?: string;
  backdrop_path?: string;
}

import CustomText from '../components/CustomText';
import { movieApi } from '../api/movieApi';
import { favoritesStorage } from '../storage/favoritesStorage';
import { ratingsStorage } from '../storage/ratingsStorage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const POSTER_HEIGHT = height * 0.6;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

type RouteParams = {
  MovieDetails: {
    movieId: number;
  };
};

export default function MovieDetailsScreen() {
  const { theme: colors } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'MovieDetails'>>();
  const navigation = useNavigation<MovieDetailsScreenNavigationProp>();
  const [movie, setMovie] = useState<MovieWithCast | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetails();
  }, [route.params?.movieId]);

  const loadMovieDetails = async () => {
    if (!route.params?.movieId) return;
    
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
      backgroundColor: '#0a0a0a',
    },
    scrollView: {
      flex: 1,
    },
    backdropContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: POSTER_HEIGHT * 0.6,
      zIndex: 0,
    },
    backdropImage: {
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 50 : 30,
      paddingHorizontal: 16,
      height: HEADER_HEIGHT,
      zIndex: 100,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    favoriteButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    favoriteButtonActive: {
      backgroundColor: 'rgba(255, 62, 62, 0.2)',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    posterContainer: {
      flexDirection: 'row',
      padding: 20,
      marginTop: POSTER_HEIGHT * 0.4,
      zIndex: 1,
    },
    posterWrapper: {
      width: width * 0.3,
      height: width * 0.45,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 10,
    },
    poster: {
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
    },
    basicInfo: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'flex-end',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    ratingText: {
      marginLeft: 4,
      fontWeight: '600',
    },
    year: {
      fontSize: 14,
    },
    duration: {
      fontSize: 14,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      marginHorizontal: 8,
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    genreChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    genreText: {
      fontSize: 12,
      fontWeight: '600',
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    overview: {
      fontSize: 14,
      lineHeight: 22,
    },
    ratingSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 16,
    },
    ratingItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingTextContainer: {
      marginLeft: 12,
    },
    ratingValue: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    ratingLabel: {
      fontSize: 12,
      opacity: 0.7,
    },
    divider: {
      width: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginHorizontal: 8,
    },
    yourRatingSection: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    starsContainer: {
      flexDirection: 'row',
      marginVertical: 12,
    },
    starButton: {
      marginHorizontal: 4,
    },
    yourRatingText: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: 4,
    },
    rateText: {
      fontSize: 12,
      opacity: 0.7,
      marginTop: 4,
    },
    infoSection: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    infoLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoIcon: {
      marginRight: 8,
    },
    infoLabel: {
      fontSize: 14,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
    },
    castSection: {
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      padding: 16,
    },
    castScrollContainer: {
      paddingRight: 16,
    },
    castItem: {
      width: 80,
      marginRight: 16,
      alignItems: 'center',
    },
    castImageContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    castImage: {
      width: '100%',
      height: '100%',
    },
    castName: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 2,
    },
    characterName: {
      fontSize: 10,
      opacity: 0.7,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0a',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0a',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      marginTop: 16,
      marginBottom: 24,
      textAlign: 'center',
    },
    backButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#e50914',
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const posterTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [-50, 0, 0],
    extrapolate: 'clamp',
  });

  const posterOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <CustomText style={[styles.loadingText, { color: colors.text }]}>
          Loading movie details...
        </CustomText>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={64} color={colors.error} />
        <CustomText style={[styles.errorText, { color: colors.text }]}>
          Movie not found
        </CustomText>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.accent }]} 
          onPress={() => navigation.goBack()}
        >
          <CustomText style={[styles.backButtonText, { color: colors.text }]}>
            Go Back
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Backdrop Image with Gradient Overlay */}
      <Animated.View 
        style={[
          styles.backdropContainer,
          { opacity: posterOpacity, transform: [{ translateY: posterTranslateY }] }
        ]}
      >
        {movie.backdropPath ? (
          <ImageBackground
            source={{ uri: movie.backdropPath }}
            style={styles.backdropImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
              style={styles.gradientOverlay}
            />
          </ImageBackground>
        ) : (
          <View style={[styles.backdropImage, { backgroundColor: colors.surface }]} />
        )}
      </Animated.View>

      {/* Header with Back Button and Favorite */}
      <Animated.View style={[styles.header, { opacity: headerOpacity, backgroundColor: 'rgba(0,0,0,0.7)' }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? '#ff3e3e' : colors.text} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event<{ contentOffset: { y: number } }>(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {movie && (
          <View style={styles.basicInfo}>
            <CustomText style={[styles.title, { color: colors.text }]}>
              {movie.title || 'No Title'}
            </CustomText>
          
            <View style={styles.metaRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <CustomText style={[styles.ratingText, { color: colors.text }]}>
                  {movie.voteAverage ? movie.voteAverage.toFixed(1) : 'N/A'}
                </CustomText>
              </View>
              <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
              <CustomText style={[styles.year, { color: colors.textSecondary }]}>
                {new Date(movie.releaseDate || '').getFullYear() || 'N/A'}
              </CustomText>
              <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
              <CustomText style={[styles.duration, { color: colors.textSecondary }]}>
                {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}
              </CustomText>
            </View>
            <View style={styles.genresContainer}>
              {movie?.genres?.slice(0, 3).map((genre, index) => (
                <View 
                  key={index} 
                  style={[styles.genreChip, { backgroundColor: colors.card }]}
                >
                  <CustomText style={[styles.genreText, { color: colors.accent }]}>
                    {typeof genre === 'string' ? genre : genre}
                  </CustomText>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
