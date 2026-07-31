import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  photo?: string;
  accessToken?: string;
}

const GoogleAuthExample = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const { handleGoogleSignIn, handleSignOut, makeAuthenticatedRequest } = useGoogleAuth(navigation);

  // Check if user is already signed in on component mount
  useEffect(() => {
    checkExistingSignIn();
  }, []);

  const checkExistingSignIn = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
        setIsSignedIn(true);
        console.log('✅ User already signed in:', user.email);
      }
    } catch (error) {
      console.error('❌ Error checking existing sign-in:', error);
    }
  };

  const signIn = async () => {
    setIsLoading(true);
    try {
      await handleGoogleSignIn();
      // The navigation will be handled by handleGoogleSignIn
      // but we can also update local state if needed
      await checkExistingSignIn();
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Error', 'Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await handleSignOut();
      setUserInfo(null);
      setIsSignedIn(false);
      setApiResponse(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      Alert.alert('Error', 'Sign-out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthenticatedRequest = async () => {
    setIsLoading(true);
    try {
      // Example of making an authenticated request
      const response = await makeAuthenticatedRequest('http://your-backend-url/api/protected-endpoint/', {
        method: 'GET',
      });
      
      setApiResponse(response.data);
      Alert.alert('Success', 'Authenticated request successful!');
    } catch (error) {
      console.error('Authenticated request error:', error);
      Alert.alert('Error', 'Authenticated request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const showUserInfo = () => {
    if (!userInfo) return null;

    return (
      <View style={styles.userInfoContainer}>
        <Text style={styles.sectionTitle}>User Information</Text>
        
        {userInfo.photo && (
          <Image
            source={{ uri: userInfo.photo }}
            style={styles.profileImage}
          />
        )}
        
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
          <Text style={styles.userId}>ID: {userInfo.id}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={testAuthenticatedRequest}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Test Authenticated Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={signOut}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {apiResponse && (
          <View style={styles.apiResponseContainer}>
            <Text style={styles.sectionTitle}>API Response</Text>
            <Text style={styles.apiResponseText}>
              {JSON.stringify(apiResponse, null, 2)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Google OAuth Login</Text>
      
      {!isSignedIn ? (
        <View style={styles.signInContainer}>
          <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
            disabled={isLoading}
          />
          <Text style={styles.instructionText}>
            Tap the button above to sign in with your Google account
          </Text>
        </View>
      ) : (
        showUserInfo()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  signInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  googleButton: {
    width: 240,
    height: 48,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  userInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: '#999',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#4285F4',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  apiResponseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  apiResponseText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});

export default GoogleAuthExample; 