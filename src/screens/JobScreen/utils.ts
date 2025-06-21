import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, Dimensions} from 'react-native';

// Constants
const {width} = Dimensions.get('window');

export const DIMENSIONS = {
  CARD_WIDTH: width - 32,
  CARD_HEIGHT: 220,
};

export const GRADIENT_COLORS = [
  ['#FF6B6B', '#FF8E8E'], // Red
  ['#4ECDC4', '#45B7A8'], // Teal
  ['#45AAF2', '#2D98DA'], // Blue
  ['#FF9FF3', '#F368E0'], // Pink
];

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

// Helper functions
export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const formatDate = (time: string) => {
  const date = new Date(time);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// API functions
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refresh: refreshToken}),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('accessToken', data.access);
      return data.access;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('accessToken');
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }
  return response;
}; 