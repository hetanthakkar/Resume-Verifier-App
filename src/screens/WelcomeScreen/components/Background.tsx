import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../styles';

export const Background = ({children}) => (
  <LinearGradient colors={['#FFFFFF', '#F0F0F3']} style={styles.background}>
    {children}
  </LinearGradient>
);
