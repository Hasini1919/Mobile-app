import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from '../components/CustomText';
import { authStorage } from '../storage/authStorage';
import { favoritesStorage } from '../storage/favoritesStorage';
import { movieApi } from '../api/movieApi';
import { User } from '../types/auth';
import { Movie } from '../types/movie';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme: colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = React.useRef<FlatList>(null);

  useEffect(() => {
    loadUser();
    loadTrendingMovies();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarouselIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % 3;
        carouselRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const carouselData = [
    {
      id: '1',
      title: user ? `Welcome back, ${user.firstName}!` : 'Welcome to StreamBox',
      subtitle: 'Discover amazing movies and TV shows',
      icon: 'user' as const,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    },
    {
      id: '2',
      title: 'StreamBox',
      subtitle: 'Your ultimate entertainment hub',
      icon: 'film' as const,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    },
    {
      id: '3',
      title: 'Explore & Enjoy',
      subtitle: 'Search, filter, and save your favorites',
      icon: 'star' as const,
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    },
  ];

  const loadUser = async () => {
    const currentUser = await authStorage.getUser();
    setUser(currentUser);
  };

  const loadTrendingMovies = async () => {
    try {
      setLoadingTrending(true);
      const movies = await movieApi.getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error loading trending movies:', error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authStorage.logoutUser();
            // Navigation will be handled automatically by AppNavigator
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
    scrollContent: {
      paddingBottom: 20,
    },
    logoutButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: 10,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 10,
    },
    header: {
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    userInfo: {
      alignItems: 'center',
      marginTop: 20,
    },
    welcomeText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 8,
    },
    usernameText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 20,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    trendingSection: {
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    seeAllText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    loadingContainer: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    trendingList: {
      paddingHorizontal: 20,
      gap: 12,
    },
    trendingCard: {
      width: 140,
      marginRight: 12,
    },
    trendingPoster: {
      width: 140,
      height: 200,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    trendingRating: {
      position: 'absolute',
      top: 8,
      left: 8,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    trendingRatingText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    trendingInfo: {
      marginTop: 8,
    },
    trendingTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
    },
    trendingYear: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    quickActions: {
      paddingHorizontal: 20,
      marginTop: 32,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    actionIcon: {
      width: 56,
      height: 56,
      backgroundColor: colors.primary + '20',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    features: {
      paddingHorizontal: 20,
      marginTop: 32,
    },
    featuresList: {
      gap: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    featureText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    carousel: {
      height: 200,
      marginTop: 60,
    },
    carouselItem: {
      width: width - 40,
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: 'hidden',
      height: 200,
      borderWidth: 1,
      borderColor: colors.border,
    },
    carouselImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
    carouselOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 20,
    },
    carouselContent: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    carouselIcon: {
      width: 70,
      height: 70,
      backgroundColor: 'rgba(0, 180, 216, 0.3)',
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    carouselTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    carouselSubtitle: {
      fontSize: 14,
      color: '#F0F0F0',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    carouselDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      gap: 8,
    },
    carouselDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    carouselDotActive: {
      width: 24,
      backgroundColor: colors.primary,
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Carousel Banner */}
      <View>
        <FlatList
          ref={carouselRef}
          data={carouselData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (width - 40)
            );
            setActiveCarouselIndex(index);
          }}
          style={styles.carousel}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
              <View style={styles.carouselOverlay} />
              <View style={styles.carouselContent}>
                <View style={styles.carouselIcon}>
                  <Feather name={item.icon} size={36} color={colors.primary} />
                </View>
                <CustomText style={styles.carouselTitle}>{item.title}</CustomText>
                <CustomText style={styles.carouselSubtitle}>{item.subtitle}</CustomText>
                {item.id === '1' && user && (
                  <CustomText style={[styles.carouselSubtitle, { marginTop: 8, fontWeight: '600' }]}>
                    @{user.username}
                  </CustomText>
                )}
              </View>
            </View>
          )}
        />
        <View style={styles.carouselDots}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.carouselDot,
                activeCarouselIndex === index && styles.carouselDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Trending Movies Section */}
      <View style={styles.trendingSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Feather name="trending-up" size={24} color={colors.primary} />
            <CustomText style={styles.sectionTitle}>Trending Now</CustomText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('MoviesTab' as never)}>
            <CustomText style={styles.seeAllText}>See All</CustomText>
          </TouchableOpacity>
        </View>

        {loadingTrending ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={trendingMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.trendingList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.trendingCard}
                onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
              >
                <Image 
                  source={{ uri: item.posterPath || item.poster || 'https://via.placeholder.com/500x750?text=No+Image' }} 
                  style={styles.trendingPoster} 
                />
                <View style={styles.trendingRating}>
                  <Feather name="star" size={12} color="#ffd700" />
                  <CustomText style={styles.trendingRatingText}>
                    {item.voteAverage ? item.voteAverage.toFixed(1) : item.rating ? item.rating.toFixed(1) : 'N/A'}
                  </CustomText>
                </View>
                <View style={styles.trendingInfo}>
                  <CustomText style={styles.trendingTitle} numberOfLines={1}>
                    {item.title}
                  </CustomText>
                  <CustomText style={styles.trendingYear}>
                    {item.releaseDate ? item.releaseDate.split('-')[0] : item.releaseYear || 'N/A'}
                  </CustomText>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.quickActions}>
        <CustomText style={styles.sectionTitle}>Quick Access</CustomText>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('MoviesTab' as never)}
        >
          <View style={styles.actionIcon}>
            <Feather name="film" size={28} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <CustomText style={styles.actionTitle}>Browse Movies</CustomText>
            <CustomText style={styles.actionSubtitle}>
              Explore our collection by language and genre
            </CustomText>
          </View>
          <Feather name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('FavoritesTab' as never)}
        >
          <View style={styles.actionIcon}>
            <Feather name="heart" size={28} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <CustomText style={styles.actionTitle}>My Favorites</CustomText>
            <CustomText style={styles.actionSubtitle}>
              View your saved movies
            </CustomText>
          </View>
          <Feather name="chevron-right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

    
    </ScrollView>
  );
}
