// GoogleAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { Platform } from 'react-native';

GoogleSignin.configure({
  iosClientId: Platform.OS === 'ios'
    ? '668046831464-mbovn6fds00gfl616877jedv7gs73v35.apps.googleusercontent.com'
    : undefined,
    webClientId:'668046831464-5pjcmbvheejjq66eoiq7jev27f2kohae.apps.googleusercontent.com',
  forceCodeForRefreshToken: true, // needed to get an accessToken
  offlineAccess: true,              // ← ask for server auth code & ID token
  scopes: ['email', 'profile'],     // ← explicitly request these
});


const API_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api',
});

const GoogleAuth = () => {
  const signIn = async () => {
    try {
      // Sign out any previous session
      await GoogleSignin.signOut();
  
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
  
      const userInfo = await GoogleSignin.signIn();
      console.log('🚀 userInfo:', userInfo);
    
      // Try to grab idToken from userInfo first:
      let idToken = (userInfo as any).idToken;
    
      // If it's still missing, fall back to getTokens()
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
    
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }
    

      const accessToken = (await GoogleSignin.getTokens()).accessToken;
  
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }
  
      const response = await axios.post(
        `${API_URL}/auth/google/`,
        {
          id_token: idToken,
          access_token: accessToken,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const {
        access_token: ourAccess,
        refresh_token: ourRefresh,
        user,
        message,
        is_new_user,
      } = response.data;
  
      await AsyncStorage.multiSet([
        ['accessToken', ourAccess],
        ['refreshToken', ourRefresh],
        ['userData', JSON.stringify(user)],
      ]);
  
      return {
        success: true,
        user,
        accessToken: ourAccess,
        refreshToken: ourRefresh,
        message,
        isNewUser: is_new_user,
      };
    } catch (error: any) {
      console.error('Google Sign-In error:', error.response?.data || error);
  
      let friendlyMsg = 'Google sign in failed';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        friendlyMsg = 'Sign-in cancelled';
      } else if (error.response?.data) {
        friendlyMsg = JSON.stringify(error.response.data);
      }
  
      return { success: false, error, message: friendlyMsg };
    }
  };
  
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error };
    }
  };

  return { signIn, signOut };
};

export default GoogleAuth;
