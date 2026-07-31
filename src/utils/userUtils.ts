import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  photo?: string;
  accessToken?: string;
  [key: string]: any;
}

/**
 * Get user data from AsyncStorage
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log('📱 Retrieved user data:', userData);
      return userData;
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is signed in
 */
export const isUserSignedIn = async (): Promise<boolean> => {
  try {
    const userData = await getUserData();
    const accessToken = await AsyncStorage.getItem('accessToken');
    return !!(userData && accessToken);
  } catch (error) {
    console.error('❌ Error checking sign-in status:', error);
    return false;
  }
};

/**
 * Get user's access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    return null;
  }
};

/**
 * Get user's refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (error) {
    console.error('❌ Error getting refresh token:', error);
    return null;
  }
};

/**
 * Update user data
 */
export const updateUserData = async (newData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(newData));
    console.log('✅ User data updated:', newData);
  } catch (error) {
    console.error('❌ Error updating user data:', error);
  }
};

/**
 * Clear all user data (sign out)
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    console.log('👋 User data cleared');
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
  }
};

/**
 * Debug function to log all stored user data
 */
export const debugUserData = async (): Promise<void> => {
  try {
    const userData = await getUserData();
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    
    console.log('🔍 Debug User Data:');
    console.log('   User Data:', userData);
    console.log('   Access Token:', accessToken ? 'Present' : 'Not present');
    console.log('   Refresh Token:', refreshToken ? 'Present' : 'Not present');
    console.log('   Signed In:', await isUserSignedIn());
  } catch (error) {
    console.error('❌ Error debugging user data:', error);
  }
};

/**
 * Get user's display name
 */
export const getUserDisplayName = async (): Promise<string> => {
  try {
    const userData = await getUserData();
    return userData?.name || userData?.givenName || 'Unknown User';
  } catch (error) {
    console.error('❌ Error getting display name:', error);
    return 'Unknown User';
  }
};

/**
 * Get user's email
 */
export const getUserEmail = async (): Promise<string | null> => {
  try {
    const userData = await getUserData();
    return userData?.email || null;
  } catch (error) {
    console.error('❌ Error getting user email:', error);
    return null;
  }
};

/**
 * Get user's profile photo URL
 */
export const getUserPhoto = async (): Promise<string | null> => {
  try {
    const userData = await getUserData();
    return userData?.photo || null;
  } catch (error) {
    console.error('❌ Error getting user photo:', error);
    return null;
  }
}; 