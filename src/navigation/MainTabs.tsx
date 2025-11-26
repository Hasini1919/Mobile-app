import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import HomeScreen from '../screens/HomeScreen';
import MoviesScreen from '../screens/MoviesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { favoritesStorage } from '../storage/favoritesStorage';
import { useTheme } from '../context/ThemeContext';

export type MainTabsParamList = {
  HomeTab: undefined;
  MoviesTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

function FavoritesTabIcon({ color, size, focused }: { color: string; size: number; focused: boolean }) {
  const [count, setCount] = useState(0);
  const isFocused = useIsFocused();
  const { theme: colors } = useTheme();

  useEffect(() => {
    loadFavoritesCount();
  }, [isFocused]);

  useEffect(() => {
    // Check favorites count every 2 seconds
    const interval = setInterval(() => {
      loadFavoritesCount();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadFavoritesCount = async () => {
    try {
      const favorites = await favoritesStorage.getFavorites();
      setCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites count:', error);
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Feather name="heart" size={size} color={color} />
      {count > 0 && (
        <View style={getBadgeStyle(colors)}>
          <CustomText style={styles.badgeText}>{count > 99 ? '99+' : count}</CustomText>
        </View>
      )}
    </View>
  );
}

export default function MainTabs() {
  const { theme: colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 28,
          paddingTop: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MoviesTab"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color, size }) => <Feather name="film" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <FavoritesTabIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function getBadgeStyle(colors: any) {
  return {
    position: 'absolute' as const,
    right: -8,
    top: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  };
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
