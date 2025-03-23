import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refresh: refreshToken}),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('access_token', data.access);
      return data.access;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const apiCall = async (url: string, options = {}) => {
  const token = await AsyncStorage.getItem('access_token');
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
