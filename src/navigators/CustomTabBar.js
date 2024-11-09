import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BottomTabBar} from '@react-navigation/material-bottom-tabs';

const CustomTabBar = props => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9FF3', '#F368E0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <BottomTabBar {...props} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
});

export default CustomTabBar;
