import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const styles = {
  background: {
    flex: 1,
  },
};

export const Background = ({children}) => (
  <LinearGradient colors={['#FFFFFF', '#F0F0F3']} style={styles.background}>
    {children}
  </LinearGradient>
); 