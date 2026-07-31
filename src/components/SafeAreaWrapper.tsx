import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  gradientColors?: string[];
  backgroundColor?: string;
  showGradient?: boolean;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  gradientColors,
  backgroundColor,
  showGradient = true,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // Use theme colors if not provided
  const defaultGradientColors = theme.colors.gradients.primary;
  const defaultBackgroundColor = theme.colors.background;

  const finalGradientColors = gradientColors || defaultGradientColors;
  const finalBackgroundColor = backgroundColor || defaultBackgroundColor;

  return (
    <View style={[styles.container, {backgroundColor: finalBackgroundColor}]}>
      {showGradient && (
        <LinearGradient
          colors={finalGradientColors}
          style={[
            styles.gradientBackground,
            {
              height: insets.top,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SafeAreaWrapper; 