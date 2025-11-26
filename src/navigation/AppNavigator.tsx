import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authStorage } from '../storage/authStorage';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import RatedMoviesScreen from '../screens/RatedMoviesScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MovieDetails: { movieId: number };
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  RatedMovies: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Check auth status every 2 seconds
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await authStorage.getToken();
      setUserToken(token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken !== null ? (
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MovieDetails" 
            component={MovieDetailsScreen}
            options={{ 
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen 
            name="EditProfile" 
            component={EditProfileScreen}
            options={{ 
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{ 
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen 
            name="RatedMovies" 
            component={RatedMoviesScreen}
            options={{ 
              headerShown: false,
              presentation: 'card',
            }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="Auth" 
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
  },
});
