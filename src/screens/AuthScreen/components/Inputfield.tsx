import React from 'react';
import {View, Text, TextInput} from 'react-native';
import styles from '../styles';

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  isGoogleSignIn,
  editable = true,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#A0AEC0"
      keyboardType={keyboardType}
      autoCapitalize="none"
      autoComplete="email"
      editable={editable}
    />
    {isGoogleSignIn && (
      <Text style={styles.googleEmailNote}>
        Email provided by Google Sign-in
      </Text>
    )}
  </View>
);
