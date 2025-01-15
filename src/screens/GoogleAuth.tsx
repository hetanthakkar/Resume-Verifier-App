// Install required dependencies:
// npm install @react-native-google-signin/google-signin axios

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import {Platform} from 'react-native';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '198848659273-77cgm68u4ptcii0pdtq3jj8hqlqbac08.apps.googleusercontent.com', // Get this from Google Cloud Console
  offlineAccess: true,
});
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
      const {refresh, access, user} = response.data;
      console.log('response', response.data);
      // Store the tokens (using your preferred storage method)
      // For example: AsyncStorage.setItem('tokens', JSON.stringify({ refresh, access }));

      // Update your app's authentication state
      // For example: dispatch(setUser(user));

      return {success: true, user};
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
