// Install required dependencies:
// npm install @react-native-google-signin/google-signin axios

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import {Platform} from 'react-native';
if (Platform.OS === 'android') {
  GoogleSignin.configure({
    webClientId:
      '483886083006-k3ggj8i676gajk3kumb3c04ov8gp45tv.apps.googleusercontent.com',
    offlineAccess: true,
  });
}
// Configure Google Sign-In
const API_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api', // Android emulator localhost equivalent
});
const GoogleAuth = () => {
  const signIn = async () => {
    try {
      // Clear any previous sign-in state
      await GoogleSignin.signOut();

      // Start the sign-in flow
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token
      const {accessToken} = await GoogleSignin.getTokens();
      console.log('oisadnf', accessToken);
      // Send the token to your backend
      const response = await axios.post(`${API_URL}/auth/google/`, {
        access_token: accessToken,
      });

      // Handle the response from your backend
      const {refresh, access, user, is_new_user} = response.data;
      console.log('google response', response.data);
      user.accessToken = access;
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      // Store the tokens (using your preferred storage method)
      // For example: AsyncStorage.setItem('tokens', JSON.stringify({ refresh, access }));

      // Update your app's authentication state
      // For example: dispatch(setUser(user));

      return {success: true, user, is_new_user};
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('Other error:', error);
      }
      return {success: false, error};
    }
  };

  return {
    signIn,
  };
};

export default GoogleAuth;
