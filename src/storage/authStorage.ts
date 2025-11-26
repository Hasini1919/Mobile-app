import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

const USER_KEY = '@streambox_user';
const TOKEN_KEY = '@streambox_token';
const REGISTERED_USERS_KEY = '@streambox_registered_users';

export const authStorage = {
  /**
   * Save user data and token to AsyncStorage
   * @param user - User object with token
   */
  saveUser: async (user: User): Promise<void> => {
    try {
      if (!user || !user.token) {
        throw new Error('Invalid user data: user and token are required');
      }
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(TOKEN_KEY, user.token);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  },

  /**
   * Get user data from AsyncStorage
   * @returns User object or null if not found
   */
  getUser: async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  /**
   * Get token from AsyncStorage
   * @returns Token string or null if not found
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Remove user data and token from AsyncStorage (logout)
   */
  logoutUser: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to logout');
    }
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  /**
   * Register a new user
   * @param username - User's username
   * @param email - User's email
   * @param password - User's password
   * @returns User object with token
   */
  registerUser: async (username: string, email: string, password: string): Promise<User> => {
    try {
      // Get existing registered users
      const existingUsersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];

      // Check if username or email already exists
      const userExists = existingUsers.find(
        (u: any) => u.username === username || u.email === email
      );
      if (userExists) {
        throw new Error('Username or email already exists');
      }

      // Create new user
      const newUser = {
        username,
        email,
        password, // In production, this should be hashed
        firstName: username,
        lastName: '',
        gender: 'male',
        image: '',
      };

      // Add to registered users
      existingUsers.push(newUser);
      await AsyncStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existingUsers));

      // Create user session
      const token = `token_${Date.now()}_${username}`;
      const user: User = {
        id: existingUsers.length,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        gender: newUser.gender,
        image: newUser.image,
        token,
      };

      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Login with registered credentials
   * @param username - User's username
   * @param password - User's password
   * @returns User object with token or null if credentials are invalid
   */
  loginWithCredentials: async (username: string, password: string): Promise<User | null> => {
    try {
      // Get registered users
      const existingUsersData = await AsyncStorage.getItem(REGISTERED_USERS_KEY);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];

      // Find user with matching credentials
      const user = existingUsers.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        return null;
      }

      // Create user session
      const token = `token_${Date.now()}_${username}`;
      const loggedInUser: User = {
        id: existingUsers.indexOf(user) + 1,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender || 'male',
        image: user.image,
        token,
      };

      return loggedInUser;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  },
};
