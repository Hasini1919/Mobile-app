import axios from 'axios';
import { AuthResponse, LoginCredentials } from '../types/auth';

const API_BASE_URL = 'https://dummyjson.com';

export const authApi = {
  /**
   * Login with username and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        {
          username: credentials.username,
          password: credentials.password,
          expiresInMins: 60,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
      throw new Error('An unexpected error occurred during login');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await axios.get<AuthResponse>(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get user profile');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {
          refreshToken,
          expiresInMins: 60,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to refresh token');
      }
      throw new Error('An unexpected error occurred');
    }
  },
};
