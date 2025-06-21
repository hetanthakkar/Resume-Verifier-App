import React from 'react';
import {View, StatusBar, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface GradientNotchScreenProps {
  children: React.ReactNode;
  gradientColors?: string[]; // Make colors customizable
  startColor?: string; // Alternative: individual color props
  endColor?: string;
  backgroundColor?: string; // Background color for the main content area
}

const GradientNotchScreen: React.FC<GradientNotchScreenProps> = ({
  children,
  gradientColors,
  startColor = '#FFFFFF', // Default start color
  endColor = '#F0F0F3', // Default end color
  backgroundColor = '#FFFFFF', // Default background color
}) => {
  const insets = useSafeAreaInsets();

  // Use either gradientColors array if provided, or construct from start/end colors
  const colors = gradientColors || [startColor, endColor];

  return (
    <View style={{flex: 1, backgroundColor}}>
      {/* Status bar area with gradient */}
      <LinearGradient
        colors={colors}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          zIndex: 1,
        }}
      />

      {/* Main content with proper safe area padding */}
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
        {children}
      </View>
    </View>
  );
};

export default GradientNotchScreen;
