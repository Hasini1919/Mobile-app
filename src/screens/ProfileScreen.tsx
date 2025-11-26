import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from '../components/CustomText';
import { RootStackParamList } from '../navigation/AppNavigator';
import { User } from '../types/auth';
import { authStorage } from '../storage/authStorage';
import { favoritesStorage } from '../storage/favoritesStorage';
import { ratingsStorage } from '../storage/ratingsStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

const { width } = Dimensions.get('window');

const cinemaImages = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
];

export default function ProfileScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cinemaImages.length;
        carouselRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authStorage.getUser();
      setUser(userData);

      const favorites = await favoritesStorage.getFavorites();
      setFavoritesCount(favorites.length);

      const ratings = await ratingsStorage.getAllRatings();
      setRatingsCount(ratings.length);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authStorage.logoutUser();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' as never }],
            });
          },
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesStorage.clearFavorites();
              setFavoritesCount(0);
              Alert.alert('Success', 'All favorites cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  const handleClearRatings = () => {
    Alert.alert(
      'Clear Ratings',
      'Are you sure you want to remove all ratings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await ratingsStorage.clearRatings();
              setRatingsCount(0);
              Alert.alert('Success', 'All ratings cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear ratings');
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
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 100,
    },
    heroSection: {
      height: 320,
      position: 'relative',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: 'hidden',
    },
    carouselSlide: {
      width: width,
      height: 320,
      backgroundColor: '#1F2937',
    },
    carouselImage: {
      width: '100%',
      height: '100%',
    },
    carouselOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    headerContent: {
      ...StyleSheet.absoluteFillObject,
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginBottom: 30,
      zIndex: 1,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationDot: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#fff',
    },
    profileContainer: {
      alignItems: 'center',
      zIndex: 1,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surface,
      borderWidth: 4,
      borderColor: '#fff',
    },
    defaultAvatar: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    editButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#fff',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    content: {
      flex: 1,
      marginTop: -20,
    },
    statsGrid: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 24,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    statIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    statTitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    actionCard: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    actionLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    carouselDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    activeDot: {
      width: 24,
      backgroundColor: '#fff',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 30,
    },
    footerText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  if (!user) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.loadingText}>Loading profile...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carousel Header */}
      <View style={styles.heroSection}>
        <FlatList
          ref={carouselRef}
          data={cinemaImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setActiveSlide(slideIndex);
          }}
          renderItem={({ item }) => (
            <View style={styles.carouselSlide}>
              <Image
                source={{ uri: item }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
              <View style={styles.carouselOverlay} />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={styles.headerContent}>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Settings' as never)}
            >
              <Feather name="settings" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Notifications' as never)}
            >
              <Feather name="bell" size={20} color="#fff" />
              {notificationCount > 0 && (
                <View style={styles.notificationDot} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => navigation.navigate('EditProfile')}
            >
              {user.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.defaultAvatar]}>
                  <Feather name="user" size={50} color={colors.primary} />
                </View>
              )}
              <View style={styles.editButton}>
                <Feather name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            <CustomText style={styles.userName}>
              {user.firstName} {user.lastName}
            </CustomText>
            <CustomText style={styles.userEmail}>{user.email}</CustomText>
          </View>

          <View style={styles.carouselDots}>
            {cinemaImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeSlide && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statIconWrapper}>
              <Feather name="heart" size={24} color={colors.primary} />
            </View>
            <CustomText style={styles.statValue}>{favoritesCount}</CustomText>
            <CustomText style={styles.statTitle}>Favorites</CustomText>
          </View>

          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => navigation.navigate('RatedMovies' as never)}
          >
            <View style={styles.statIconWrapper}>
              <Feather name="star" size={24} color={colors.primary} />
            </View>
            <CustomText style={styles.statValue}>{ratingsCount}</CustomText>
            <CustomText style={styles.statTitle}>Ratings</CustomText>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Quick Actions</CustomText>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Feather name="edit" size={24} color={colors.primary} />
              </View>
              <CustomText style={styles.actionLabel}>Edit Profile</CustomText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleClearFavorites}
              disabled={favoritesCount === 0}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.secondary}20` }]}>
                <Feather name="trash-2" size={24} color={colors.secondary} />
              </View>
              <CustomText style={styles.actionLabel}>Clear Favorites</CustomText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleClearRatings}
              disabled={ratingsCount === 0}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.accent}20` }]}>
                <Feather name="x-circle" size={24} color={colors.accent} />
              </View>
              <CustomText style={styles.actionLabel}>Clear Ratings</CustomText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleLogout}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.error}20` }]}>
                <Feather name="log-out" size={24} color={colors.error} />
              </View>
              <CustomText style={styles.actionLabel}>Logout</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <CustomText style={styles.footerText}>StreamBox v1.0.0</CustomText>
        </View>
      </ScrollView>
    </View>
  );
}
