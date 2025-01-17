import React from 'react';
import {Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import styles from '../styles';

export const LottieSection = ({lottieRef, opacity}) => (
  <Animated.View style={[styles.lottieContainer, {opacity}]}>
    <LottieView
      ref={lottieRef}
      source={require('../../../../assets/animation.json')}
      style={styles.lottieAnimation}
      autoPlay
      loop
    />
  </Animated.View>
);
