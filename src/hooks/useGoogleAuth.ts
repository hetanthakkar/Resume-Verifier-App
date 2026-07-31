// useGoogleAuth.tsx
import GoogleAuth from './GoogleAuth';
import { Alert } from 'react-native';

export const useGoogleAuth = navigation => {
  const { signIn, signOut } = GoogleAuth();

  const handleGoogleSignIn = async () => {
    try {
      const { success, user, accessToken, refreshToken, message, error, isNewUser } = await signIn();
      if (!success) {
        console.error('Login failed:', error);
        Alert.alert('Error', message);
        return;
      }
      
      // Check if user is new or doesn't have company information
      if (isNewUser || !user?.company) {
        // User needs to provide company info
        navigation.navigate('CompanySelection', { 
          googleUser: user, 
          user, 
          accessToken, 
          refreshToken 
        });
      } else {
        // User already has company info, go directly to home
        navigation.navigate('Home', { user, accessToken, refreshToken });
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handleSignOut = async () => {
    try {
      const { success, error } = await signOut();
      if (success) {
        Alert.alert('Success', 'Successfully signed out!');
        navigation.navigate('Welcome');
      } else {
        console.error('Sign out failed:', error);
        Alert.alert('Error', 'Sign out failed');
      }
    } catch (err) {
      console.error('Sign out error:', err);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return { handleGoogleSignIn, handleSignOut };
};
