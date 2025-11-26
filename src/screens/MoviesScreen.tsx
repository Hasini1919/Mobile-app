import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomText from '../components/CustomText';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { Movie, Language, Genre } from '../types/movie';
import { movieApi } from '../api/movieApi';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES: Language[] = ['English', 'Tamil', 'Hindi', 'Sinhala', 'Malayalam', 'Telugu', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Russian', 'Portuguese', 'Turkish', 'Thai', 'Vietnamese', 'Indonesian', 'Dutch', 'Swedish', 'Polish', 'Greek', 'Hebrew', 'Persian'];
const GENRES: Genre[] = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Superhero', 'Thriller', 'War', 'Western'];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;

export default function MoviesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme: colors } = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery, selectedLanguage, selectedGenre]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [allMovies, trending] = await Promise.all([
        movieApi.getAllMovies(),
        movieApi.getTrendingMovies()
      ]);
      setMovies(allMovies);
      setFilteredMovies(allMovies);
      setTrendingMovies(trending);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  const filterMovies = async () => {
    let result = [...movies];

    // Filter by language
    if (selectedLanguage) {
      result = result.filter((movie) => movie.language === selectedLanguage);
    }

    // Filter by genre
    if (selectedGenre) {
      result = result.filter((movie) => movie.genres?.includes(selectedGenre as Genre));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(lowerQuery) ||
          movie.cast?.some((actor) => actor.toLowerCase().includes(lowerQuery)) ||
          movie.genres?.some((genre) => genre.toLowerCase().includes(lowerQuery)) ||
          movie.director?.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredMovies(result);
  };

  const handleLanguagePress = (language: string) => {
    setSelectedLanguage(selectedLanguage === language ? null : language);
  };

  const handleGenrePress = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
  };

  const clearFilters = () => {
    setSelectedLanguage(null);
    setSelectedGenre(null);
    setSearchQuery('');
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
      paddingBottom: 24,
      backgroundColor: colors.background,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 12,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    filtersContainer: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
    },
    searchSection: {
      marginBottom: 12,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    compactDropdown: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 14,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    compactDropdownText: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    clearButton: {
      padding: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    dropdownModal: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      width: '100%',
      maxHeight: '70%',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    },
    dropdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    dropdownList: {
      maxHeight: 400,
    },
    dropdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemText: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    dropdownItemTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    resultsText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginLeft: 4,
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
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <CustomText style={styles.loadingText}>Loading movies...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Feather name="film" size={32} color={colors.primary} />
          <CustomText style={styles.headerTitle}>Movies</CustomText>
        </View>
        <CustomText style={styles.headerSubtitle}>
          Discover your favorite entertainment
        </CustomText>
      </View>

      {/* Search & Filters */}
      <View style={styles.filtersContainer}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          {/* Language Dropdown */}
          <TouchableOpacity
            style={styles.compactDropdown}
            onPress={() => setShowLanguageDropdown(true)}
          >
            <Feather name="globe" size={16} color={colors.primary} />
            <CustomText style={styles.compactDropdownText}>
              {selectedLanguage || 'Language'}
            </CustomText>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Genre Dropdown */}
          <TouchableOpacity
            style={styles.compactDropdown}
            onPress={() => setShowGenreDropdown(true)}
          >
            <Feather name="grid" size={16} color={colors.primary} />
            <CustomText style={styles.compactDropdownText}>
              {selectedGenre || 'Genre'}
            </CustomText>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Clear Filters */}
          {(selectedLanguage || selectedGenre) && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Feather name="x-circle" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results Count */}
        <CustomText style={styles.resultsText}>
          {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
        </CustomText>
      </View>

      {/* Language Dropdown Modal */}
      <Modal
        visible={showLanguageDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <CustomText style={styles.dropdownTitle}>Select Language</CustomText>
              <TouchableOpacity onPress={() => setShowLanguageDropdown(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedLanguage(null);
                  setShowLanguageDropdown(false);
                }}
              >
                <CustomText style={[styles.dropdownItemText, !selectedLanguage && styles.dropdownItemTextActive]}>
                  All Languages
                </CustomText>
                {!selectedLanguage && <Feather name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleLanguagePress(language);
                    setShowLanguageDropdown(false);
                  }}
                >
                  <CustomText style={[styles.dropdownItemText, selectedLanguage === language && styles.dropdownItemTextActive]}>
                    {language}
                  </CustomText>
                  {selectedLanguage === language && <Feather name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Genre Dropdown Modal */}
      <Modal
        visible={showGenreDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenreDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenreDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <CustomText style={styles.dropdownTitle}>Select Genre</CustomText>
              <TouchableOpacity onPress={() => setShowGenreDropdown(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedGenre(null);
                  setShowGenreDropdown(false);
                }}
              >
                <CustomText style={[styles.dropdownItemText, !selectedGenre && styles.dropdownItemTextActive]}>
                  All Genres
                </CustomText>
                {!selectedGenre && <Feather name="check" size={20} color={colors.primary} />}
              </TouchableOpacity>
              {GENRES.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleGenrePress(genre);
                    setShowGenreDropdown(false);
                  }}
                >
                  <CustomText style={[styles.dropdownItemText, selectedGenre === genre && styles.dropdownItemTextActive]}>
                    {genre}
                  </CustomText>
                  {selectedGenre === genre && <Feather name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="film" size={64} color={colors.border} />
          <CustomText style={styles.emptyText}>No movies found</CustomText>
          <CustomText style={styles.emptySubtext}>
            Try adjusting your filters or search query
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          renderItem={({ item }) => (
            <MovieCard 
              movie={item} 
              onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
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
