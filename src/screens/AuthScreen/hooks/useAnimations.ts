import {useRef} from 'react';
import {Animated} from 'react-native';

export const useAnimations = (isGoogleSignIn: boolean) => {
  const slideAnimation = useRef(
    new Animated.Value(isGoogleSignIn ? 1 : 0),
  ).current;
  const otpOpacity = useRef(new Animated.Value(0)).current;
  const lottieOpacity = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const animateTransition = (show: boolean) => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(otpOpacity, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateTransition1 = (show: boolean) => {
    Animated.timing(slideAnimation, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutLottie = (callback: () => void) => {
    Animated.timing(lottieOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(callback);
  };

  const animateButton = (pressed: boolean) => {
    Animated.spring(buttonScale, {
      toValue: pressed ? 0.95 : 1,
      useNativeDriver: true,
    }).start();
  };

  return {
    slideAnimation,
    otpOpacity,
    lottieOpacity,
    buttonScale,
    animateTransition,
    animateTransition1,
    fadeOutLottie,
    animateButton,
  };
};
