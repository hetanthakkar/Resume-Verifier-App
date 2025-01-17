// SubmitButton.js
import React from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles';

export const SubmitButton = ({state, handlers, animations}) => {
  const getButtonText = () => {
    if (state.isLoading) {
      return 'Please wait...';
    }
    if (state.isGoogleSignIn) {
      return 'Complete Registration';
    }
    return 'Continue';
  };

  const handlePress = () => {
    if (state.isGoogleSignIn) {
      return handlers.handleSubmit();
    }
    if (state.showPassword) {
      return state.isNewUser
        ? handlers.handleRegister()
        : handlers.handleLogin();
    }
    if (state.showOTP) {
      return handlers.handleSubmitOTP();
    }
    return handlers.handleContinue();
  };

  return (
    <View style={styles.bottomButtonContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        // onPressIn={() => handlers.animateButton(true)}
        // onPressOut={() => handlers.animateButton(false)}
        onPress={handlePress}
        disabled={state.isLoading}>
        <Animated.View
          style={[styles.button, {transform: [{scale: animations}]}]}>
          <LinearGradient
            colors={['#007AFF', '#0056B3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};
