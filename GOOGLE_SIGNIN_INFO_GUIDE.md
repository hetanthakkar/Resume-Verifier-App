# How to Get Google Sign-In Information

This guide explains how to retrieve and use Google Sign-In user information in your React Native app.

## 1. Current Implementation

### Backend API Call
Your backend expects the `id_token` from Google, not the `access_token`:

```bash
curl -X POST http://localhost:8000/api/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{"id_token": "YOUR_GOOGLE_ID_TOKEN"}'
```

### Updated GoogleAuth.tsx
The implementation now correctly sends the `id_token`:

```javascript
// Send the ID token to your backend (not access token)
const response = await axios.post(`${API_URL}/auth/google/`, {
  id_token: (userInfo as any).idToken, // Use id_token as required by your backend
});
```

## 2. Google Sign-In Information Available

### From Google SDK Response (userInfo object):
When you call `GoogleSignin.signIn()`, you get:

```javascript
{
  id: '123456789',                    // Unique Google user ID
  name: 'John Doe',                   // Full name
  givenName: 'John',                  // First name
  familyName: 'Doe',                  // Last name
  email: 'john.doe@gmail.com',        // Email address
  photo: 'https://lh3.googleusercontent.com/...', // Profile picture URL
  scopes: ['email', 'profile'],       // Granted permissions
  serverAuthCode: '4/0AfJohXn...',    // Server authorization code
  idToken: 'eyJhbGciOiJSUzI1NiIs...', // JWT token (what your backend needs)
}
```

### From Your Backend Response:
After sending the `id_token`, your backend returns:

```javascript
{
  refresh: 'refresh_token_here',      // Refresh token for your API
  access: 'access_token_here',        // Access token for your API
  user: {                            // User object from your database
    id: 'user_id',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    // ... other user fields
  },
  is_new_user: true                  // Boolean indicating if user is new
}
```

## 3. How to Access User Information

### Method 1: From AsyncStorage (After Sign-In)
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserData = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    console.log('Stored User Data:', userData);
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
```

### Method 2: Create a Custom Hook
```javascript
// src/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (newData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(newData));
      setUserData(newData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setUserData(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return { userData, loading, updateUserData, clearUserData };
};
```

### Method 3: Using the Hook in Components
```javascript
import { useUserData } from '../hooks/useUserData';

const ProfileScreen = () => {
  const { userData, loading } = useUserData();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userData) {
    return <Text>Not signed in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {userData.name}!</Text>
      <Text>Email: {userData.email}</Text>
      {userData.photo && (
        <Image source={{ uri: userData.photo }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
};
```

## 4. Debugging and Testing

### Console Logs
The current implementation includes detailed logging:

```javascript
console.log('🚀 Starting Google Sign-In process...');
console.log('📋 Google User Information:', JSON.stringify(userInfo, null, 2));
console.log('✅ Access token retrieved:', accessToken ? 'Present' : 'Not present');
console.log('🌐 Sending ID token to backend...');
console.log('📡 Backend Response:', response.data);
console.log('💾 User data stored in AsyncStorage');
console.log('🎉 Final User Data Available in App:', user);
```

### Check AsyncStorage
```javascript
// Debug function to check stored data
const debugStoredData = async () => {
  const userData = await AsyncStorage.getItem('userData');
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  
  console.log('Stored User Data:', userData);
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
};
```

## 5. Step-by-Step Flow

1. **User taps "Continue with Google"**
2. **GoogleSignin.signIn()** returns userInfo with idToken
3. **Send idToken to backend** via POST to `/api/auth/google/`
4. **Backend validates idToken** and returns user data
5. **Store user data** in AsyncStorage
6. **Navigate user** to appropriate screen

## 6. Key Points

### ✅ What's Working:
- Google Sign-In configuration for both iOS and Android
- Correct backend API call with `id_token`
- User data storage in AsyncStorage
- Detailed logging for debugging
- Error handling for various scenarios

### 🔧 What You Need:
- Backend API endpoint at `/api/auth/google/` that accepts `id_token`
- Proper Google OAuth configuration in Google Cloud Console
- Valid client IDs for both platforms

### 📱 Testing:
1. Run the app on device/emulator
2. Tap "Continue with Google"
3. Complete Google authentication
4. Check console logs for detailed information
5. Verify user data is stored and accessible

## 7. Common Issues

### Issue: Backend API error
**Solution**: Ensure your backend endpoint accepts `id_token` in the request body.

### Issue: Google Sign-In fails
**Solution**: Check that your client IDs are correct and Google Sign-In is enabled in Google Cloud Console.

### Issue: User data not stored
**Solution**: Check AsyncStorage permissions and ensure the backend response contains the expected user data.

### Issue: TypeScript errors
**Solution**: Use type assertion `(userInfo as any).idToken` to access the idToken property. 