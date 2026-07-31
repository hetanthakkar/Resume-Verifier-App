# Dark Theme Implementation

This document outlines the comprehensive dark theme implementation for the React Native app.

## Overview

The app now supports three theme modes:
- **Light**: Traditional light theme with white backgrounds
- **Dark**: Modern dark theme with black/dark gray backgrounds  
- **System**: Automatically follows the device's system theme preference

## Architecture

### Theme System Components

1. **Theme Definitions** (`src/theme/theme.ts`)
   - `lightTheme`: Complete light theme configuration
   - `darkTheme`: Complete dark theme configuration
   - Type definitions for theme structure

2. **Theme Context** (`src/theme/ThemeContext.tsx`)
   - `ThemeProvider`: Wraps the app and provides theme context
   - `useTheme`: Hook to access current theme and theme functions
   - Automatic theme persistence using AsyncStorage
   - System theme detection

3. **Theme Selector** (`src/theme/ThemeSelector.tsx`)
   - UI component for theme selection
   - Modal-based theme picker
   - Visual feedback for selected theme

4. **Theme Toggle** (`src/components/ThemeToggle.tsx`)
   - Simple toggle button for quick theme switching
   - Can be placed anywhere in the app

## Theme Structure

### Colors
```typescript
interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceSecondary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Border colors
  border: string;
  borderSecondary: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Gradient colors
  gradients: {
    primary: string[];
    secondary: string[];
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
    purple: string[];
    pink: string[];
    blue: string[];
    teal: string[];
  };
  
  // Component specific colors
  card: string;
  input: string;
  button: string;
  buttonSecondary: string;
  tabBar: string;
  statusBar: string;
}
```

### Spacing & Typography
```typescript
interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;  // 4
    sm: number;  // 8
    md: number;  // 16
    lg: number;  // 24
    xl: number;  // 32
    xxl: number; // 48
  };
  borderRadius: {
    sm: number;  // 4
    md: number;  // 8
    lg: number;  // 12
    xl: number;  // 16
  };
  typography: {
    h1: { fontSize: number; fontWeight: string; };
    h2: { fontSize: number; fontWeight: string; };
    h3: { fontSize: number; fontWeight: string; };
    body: { fontSize: number; fontWeight: string; };
    caption: { fontSize: number; fontWeight: string; };
  };
}
```

## Usage

### Basic Theme Usage

```typescript
import { useTheme } from '../theme/ThemeContext';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Hello World
      </Text>
      <TouchableOpacity onPress={toggleTheme}>
        <Text>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Theme-Aware Components

#### SafeAreaWrapper
```typescript
import SafeAreaWrapper from '../components/SafeAreaWrapper';

// Automatically uses theme colors
<SafeAreaWrapper>
  <YourContent />
</SafeAreaWrapper>

// Or with custom colors
<SafeAreaWrapper 
  gradientColors={theme.colors.gradients.primary}
  backgroundColor={theme.colors.background}
>
  <YourContent />
</SafeAreaWrapper>
```

#### Theme Toggle Button
```typescript
import ThemeToggle from '../components/ThemeToggle';

// Simple toggle button
<ThemeToggle />

// Custom size
<ThemeToggle size={32} />
```

### Theme Selection

Users can change themes through:
1. **Settings Screen**: Navigate to Settings → Appearance → Theme
2. **Theme Toggle**: Quick toggle button (if implemented in header)
3. **System Preference**: Automatically follows device theme

## Implementation Status

### ✅ Completed Components
- [x] Theme system architecture
- [x] Theme context and provider
- [x] Theme selector UI
- [x] App.tsx integration
- [x] SafeAreaWrapper theming
- [x] Settings screen theming
- [x] EditModal theming
- [x] CustomTabBar theming
- [x] HomeTabNavigator theming
- [x] LandingScreen theming
- [x] Theme toggle component

### 🔄 Partially Updated
- [ ] LoginScreen (needs more comprehensive theming)
- [ ] Other screens (JobsScreen, CreateJobScreen, etc.)

### 📋 To Do
- [ ] Update remaining screens to use theme colors
- [ ] Add theme toggle to app header
- [ ] Update all hardcoded colors throughout the app
- [ ] Test on both iOS and Android
- [ ] Add theme-aware animations
- [ ] Update PDF viewer components
- [ ] Theme-aware form components

## Best Practices

### 1. Always Use Theme Colors
```typescript
// ❌ Don't use hardcoded colors
<View style={{ backgroundColor: '#FFFFFF' }}>

// ✅ Use theme colors
<View style={{ backgroundColor: theme.colors.background }}>
```

### 2. Use Dynamic Styling
```typescript
// ✅ Good: Dynamic styling with theme
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
});
```

### 3. Handle Status Bar
```typescript
// ✅ Good: Dynamic status bar
<StatusBar 
  barStyle={isDark ? "light-content" : "dark-content"}
  backgroundColor={theme.colors.statusBar}
/>
```

### 4. Use Gradient Colors
```typescript
// ✅ Good: Use theme gradients
<LinearGradient colors={theme.colors.gradients.primary}>
  <YourContent />
</LinearGradient>
```

## Testing

### Manual Testing Checklist
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] System theme follows device preference
- [ ] Theme persists after app restart
- [ ] Theme switching is smooth
- [ ] All text is readable in both themes
- [ ] Status bar adapts to theme
- [ ] Tab bar colors are appropriate
- [ ] Modal backgrounds are correct
- [ ] Input fields are properly styled

### Automated Testing
Consider adding tests for:
- Theme context functionality
- Theme persistence
- Theme switching
- Component theming

## Troubleshooting

### Common Issues

1. **Theme not updating**: Ensure component is wrapped in ThemeProvider
2. **Colors not changing**: Check if hardcoded colors are being used
3. **Status bar issues**: Verify StatusBar component is using theme colors
4. **Performance**: Theme changes should be smooth and not cause re-renders

### Debug Tips

```typescript
// Add this to debug theme changes
const { theme, isDark } = useTheme();
console.log('Current theme:', isDark ? 'dark' : 'light');
console.log('Theme colors:', theme.colors);
```

## Future Enhancements

1. **Custom Themes**: Allow users to create custom color schemes
2. **Theme Presets**: Pre-built theme variations (e.g., high contrast, blue theme)
3. **Animated Transitions**: Smooth animations when switching themes
4. **Per-Screen Themes**: Different themes for different screens
5. **Accessibility**: Enhanced support for accessibility features

## Dependencies

The theme system uses these existing dependencies:
- `@react-native-async-storage/async-storage`: Theme persistence
- `react-native-vector-icons`: Theme toggle icons
- `react-native-linear-gradient`: Gradient backgrounds

No additional dependencies were required for the theme implementation. 