import GoogleAuth from './GoogleAuth';
import {Alert} from 'react-native';

export const useGoogleAuth = navigation => {
  const handleGoogleSignIn = async () => {
    const {signIn} = GoogleAuth();

    try {
      const {success, user, error, is_new_user} = await signIn();
      if (success) {
        if (is_new_user) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Login', {
            googleUser: {
              email: user.email,
              name: user.name || '',
              familyName: user.familyName || '',
              givenName: user.givenName || '',
              accessToken: user.accessToken,
            },
            isGoogleSignIn: true,
          });
        }
      } else {
        console.error('Login failed:', error);
        Alert.alert('Error', 'Google sign in failed');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  return {handleGoogleSignIn};
};
