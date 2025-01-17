import React from 'react';
import {Animated, View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../styles';

export const OTPVerification = ({state, handlers, animations, refs}) => (
  <Animated.View
    style={[
      styles.otpSection,
      {
        opacity: animations.otpOpacity,
        transform: [
          {
            translateY: animations.slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      },
    ]}>
    <View style={styles.otpHeader}>
      <Text style={styles.verifyTitle}>Verify your email</Text>
      <Text style={styles.subText}>
        Enter the 6-digit code sent to {state.confirmedEmail}
      </Text>
    </View>

    <View style={styles.otpContainer}>
      {state.otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (refs.current[index] = ref)}
          style={[styles.otpInput, digit && styles.otpInputFilled]}
          maxLength={1}
          keyboardType="numeric"
          value={digit}
          onChangeText={text => handlers.handleOTPChange(text, index)}
          editable={!state.isLoading}
          autoFocus={index === 0} // Added this line
        />
      ))}
    </View>

    <TouchableOpacity
      style={styles.resendButton}
      onPress={handlers.handleResendOTP}
      disabled={state.isLoading}>
      <Text style={styles.resendText}>Resend Code</Text>
    </TouchableOpacity>
  </Animated.View>
);
