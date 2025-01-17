import React from 'react';
import {View} from 'react-native';
import GradientText from '../../gradienttext';
import {styles} from '../styles';

export const Header = () => (
  <View style={styles.header}>
    <GradientText leftMargin={0} />
  </View>
);
