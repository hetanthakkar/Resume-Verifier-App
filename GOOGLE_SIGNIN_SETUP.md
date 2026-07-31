# Google Sign-In Setup

This document explains the Google Sign-In configuration for the Resume Verifier app.

## Configuration

### Android
- Google Sign-In is configured in `android/app/build.gradle` with the web client ID
- The configuration is handled in `src/hooks/GoogleAuth.tsx`
- Uses **Web Client ID**: `943496437066-27ssth34tt07g4gfn0pr85gen3j8ivhi.apps.googleusercontent.com`

### iOS
- Google Sign-In URL scheme is configured in `ios/resumeverifier/Info.plist`
- The configuration is handled in `src/hooks/GoogleAuth.tsx`
- Uses **Native Client ID**: `198848659273-77cgm68u4ptcii0pdtq3jj8hqlqbac08.apps.googleusercontent.com`
- URL scheme: `com.googleusercontent.apps.198848659273-77cgm68u4ptcii0pdtq3jj8hqlqbac08`

## Client ID Types

### Web Client ID (Android)
- Used for Android platform
- Supports server-side token validation
- Configured in `webClientId` parameter

### Native Client ID (iOS)
- Used for iOS platform
- Supports custom URL schemes
- Configured in `iosClientId` parameter
- Must match the URL scheme in Info.plist

## Implementation Details

### Files Modified
1. `src/screens/WelcomeScreen/AuthButtons.tsx` - Removed Apple login, kept Google and email
2. `src/screens/WelcomeScreen/index.tsx` - Removed platform-specific logic
3. `src/screens/LandingScreen.tsx` - Removed Apple login, kept Google and email
4. `src/hooks/GoogleAuth.tsx` - Updated configuration with correct client ID types
5. `ios/resumeverifier/Info.plist` - Added Google Sign-In URL scheme with native client ID

### Google Sign-In Flow
1. User taps "Continue with Google" button
2. Google Sign-In SDK handles authentication
3. ID token is sent to backend API
4. Backend validates token and returns user data
5. User data is stored in AsyncStorage
6. User is navigated to appropriate screen based on whether they're new or existing

### Error Handling
- Sign-in cancelled by user
- Sign-in already in progress
- Play services not available (Android)
- Network errors
- Backend API errors

## Dependencies
- `@react-native-google-signin/google-signin` - Google Sign-In SDK
- `axios` - HTTP client for API calls
- `@react-native-async-storage/async-storage` - Local storage

## Testing
To test Google Sign-In:
1. Run the app on a device or emulator
2. Tap "Continue with Google" on the welcome screen
3. Complete Google authentication
4. Verify user data is stored and navigation works correctly 