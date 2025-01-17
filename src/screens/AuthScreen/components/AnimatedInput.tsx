import React from 'react';
import {Animated, Text, TextInput} from 'react-native';
import styles from '../styles';

export const AnimatedInput = ({
  label,
  value,
  onChangeText,
  animation,
  placeholder = '',
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
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#A0AEC0"
      editable={editable}
    />
  </Animated.View>
);
