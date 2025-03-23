import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await api.post('/auth/refresh-token/', {
          refresh: refreshToken
        });

        if (response.data.access) {
          // Store the new access token
          await AsyncStorage.setItem('access_token', response.data.access);
          
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        // You might want to add navigation logic here to redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
    problem_category: string;
    problem_description: string;
  }) => {
    try {
      const response = await api.post('/auth/register/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (data: { email: string; otp: string }) => {
    try {
      const response = await api.post('/auth/verify-otp/', data);
      if (response.data.access) {
        await AsyncStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        await AsyncStorage.setItem('refresh_token', response.data.refresh);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      // Clear any existing tokens before login
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      
      const response = await api.post('/auth/login/', data);
      
      if (response.data.access) {
        await AsyncStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        await AsyncStorage.setItem('refresh_token', response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        throw new Error('Please check your email and password');
      } else {
        throw new Error('Failed to login. Please try again.');
      }
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    } catch (error) {
      throw error;
    }
  },
};

export const problemAPI = {
  createProblem: async (data: {
    problem_category: string;
    problem_description: string;
  }) => {
    try {
      const response = await api.post('/problems/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProblem: async () => {
    try {
      const response = await api.get('/problems/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const matchAPI = {
  findMatches: async () => {
    try {
      const response = await api.post('/matches/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMatches: async () => {
    try {
      const response = await api.get('/matches/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const chatAPI = {
  getChats: async () => {
    try {
      const response = await api.get('/chats/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getChatMessages: async (chatId: number) => {
    try {
      const response = await api.get(`/chats/${chatId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (chatId: number, message: string) => {
    try {
      const response = await api.post(`/chats/${chatId}/`, { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 