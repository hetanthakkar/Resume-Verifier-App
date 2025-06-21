import React from 'react';
import {View, ViewStyle} from 'react-native';
import GradientText from '../gradienttext';

const styles = {
  header: {
    padding: 16,
    marginTop: 10,
  } as ViewStyle,
};

export const Header = () => (
  <View style={styles.header}>
    <GradientText leftMargin={0} />
  </View>
); 