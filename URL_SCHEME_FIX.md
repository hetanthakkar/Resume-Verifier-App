# URL Scheme Fix for Google Sign-In

## Issue
The app was getting the error "custom scheme urls are not allowed for web client type" because the iOS configuration was using a web client ID instead of a native client ID.

## Problem
- iOS requires a **native client ID** for custom URL schemes
- Web client IDs cannot use custom URL schemes
- The configuration was incorrectly using the same web client ID for both platforms

## Solution
Updated the configuration to use the correct client ID types:
- **Android**: Web Client ID (`943496437066-27ssth34tt07g4gfn0pr85gen3j8ivhi`)
- **iOS**: Native Client ID (`198848659273-77cgm68u4ptcii0pdtq3jj8hqlqbac08`)

## Files Updated

### 1. GoogleAuth.tsx
**File**: `src/hooks/GoogleAuth.tsx`
**Change**: Updated to use correct client ID types:
```javascript
GoogleSignin.configure({
  webClientId: '943496437066-27ssth34tt07g4gfn0pr85gen3j8ivhi.apps.googleusercontent.com', // Web client ID for Android
  offlineAccess: true,
  iosClientId: Platform.OS === 'ios' ? '198848659273-77cgm68u4ptcii0pdtq3jj8hqlqbac08.apps.googleusercontent.com' : undefined, // Native client ID for iOS
});
```

### 2. iOS Info.plist
**File**: `ios/resumeverifier/Info.plist`
**Change**: Updated URL scheme to use native client ID:
```
com.googleusercontent.apps.198848659273-77cgm68u4ptcii0pdtq3jj8hqlqbac08
```

## Client ID Types Explained

### Web Client ID
- Used for Android and web applications
- Supports server-side token validation
- Cannot use custom URL schemes
- Configured in `webClientId` parameter

### Native Client ID
- Used for iOS applications
- Supports custom URL schemes
- Required for iOS Google Sign-In
- Configured in `iosClientId` parameter
- Must match the URL scheme in Info.plist

## Result
Now the configuration uses the correct client ID types:
- ✅ Android uses web client ID
- ✅ iOS uses native client ID
- ✅ URL scheme matches native client ID
- ✅ No more "custom scheme urls are not allowed" error

The Google Sign-In should now work properly on both iOS and Android platforms. 