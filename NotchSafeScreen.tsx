import React from 'react';
import {View, StatusBar, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface GradientNotchScreenProps {
  children: React.ReactNode;
  gradientColors?: string[]; // Make colors customizable
  startColor?: string; // Alternative: individual color props
  endColor?: string;
}

const GradientNotchScreen: React.FC<GradientNotchScreenProps> = ({
  children,
  gradientColors,
  startColor = '#FFFFFF', // Default start color
  endColor = '#F0F0F3', // Default end color
}) => {
  const insets = useSafeAreaInsets();

  const topHeight = Platform.select({
    ios: insets.top,
    android: StatusBar.currentHeight || insets.top,
  });

  // Use either gradientColors array if provided, or construct from start/end colors
  const colors = gradientColors || [startColor, endColor];

  return (
    <View style={{flex: 1}}>
      {/* Notch area with gradient */}
      <LinearGradient
        colors={colors}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: topHeight,
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          marginTop: topHeight,
        }}>
        {children}
      </View>
    </View>
  );
};

export default GradientNotchScreen;
