import React from 'react';
import {Animated, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../styles';

export const PasswordInput = ({
  value,
  onChangeText,
  animation,
  navigation,
  editable = true,
}) => (
  <Animated.View
    style={[
      styles.inputContainer,
      {
        opacity: animation,
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      },
    ]}>
    <Text style={styles.label}>Password</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Enter your password"
      placeholderTextColor="#A0AEC0"
      secureTextEntry
      editable={editable}
    />
    <TouchableOpacity
      style={styles.forgotPasswordButton}
      onPress={() => navigation.navigate('ForgotPassword')}
      disabled={!editable}>
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
    </TouchableOpacity>
  </Animated.View>
);
