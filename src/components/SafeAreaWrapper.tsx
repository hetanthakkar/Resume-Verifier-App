import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  gradientColors?: string[];
  backgroundColor?: string;
  showGradient?: boolean;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  gradientColors = ['#FFFFFF', '#F0F0F3'],
  backgroundColor = '#FFFFFF',
  showGradient = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {showGradient && (
        <LinearGradient
          colors={gradientColors}
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