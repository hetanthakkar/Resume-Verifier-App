import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandingScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/AuthScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import HomeTabNavigator from './HomeTabNavigator';

const Stack = createNativeStackNavigator();
const API_BASE_URL = 'http://localhost:8000/api';

const BackButton = ({navigation}) => (
  <TouchableOpacity
    style={styles.backButton}
    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
    onPress={() => navigation.goBack()}>
    <Ionicons name="chevron-back" size={28} color="#0056B3" />
  </TouchableOpacity>
);

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const refreshAccessToken = async refreshToken => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.access);
        if (data.refresh) {
          await AsyncStorage.setItem('refresh_token', data.refresh);
        }
        return data.access;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('refresh_token'),
      ]);

      if (accessToken) {
        setIsAuthenticated(true);
        // Refresh token in background if refresh token exists
        if (refreshToken) {
          refreshAccessToken(refreshToken);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#45AAF2" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Landing'}
      screenOptions={({navigation}) => ({
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitleStyle: {
          color: '#1C1C1E',
          fontSize: 17,
          fontWeight: '600',
        },
        headerLeftContainerStyle: styles.headerLeftContainer,
        headerBackVisible: false,
      })}>
      <Stack.Screen
        name="Landing"
        options={{
          headerShown: false,
          headerTitle: '',
          headerTransparent: true,
        }}
        component={LandingScreen}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgetPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    marginLeft: Platform.OS === 'ios' ? 8 : 0,
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Platform.OS === 'ios' ? 0 : 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
});

export default AppNavigator;
