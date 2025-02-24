import React from 'react';
import {View} from 'react-native';
import styles from '../styles';
import {InputField} from './Inputfield';
import {AnimatedInput} from './AnimatedInput';
import {PasswordInput} from './PasswordInput';

export const LoginForm = ({state, handlers, animations, navigation}) => {
  // Calculate dynamic styles based on visible elements
  const formStyle = {
    ...styles.form,
    // Remove flex: 1 when fields are hidden to prevent extra spacing
    flex: state.showOTP ? 0 : 1,
    // Add marginBottom only when needed
    marginBottom: state.showOTP ? 0 : 20,
  };

  return (
    <View style={formStyle}>
      <InputField
        label="Enter Your Email"
        value={state.email}
        onChangeText={handlers.handleEmailChange}
        placeholder="name@company.com"
        keyboardType="email-address"
        isGoogleSignIn={state.isGoogleSignIn}
      />
      {state.showName && (
        <AnimatedInput
          label="Full Name"
          value={state.name}
          onChangeText={handlers.setName}
          animation={animations.slideAnimation}
        />
      )}
      {state.showCompany && (
        <AnimatedInput
          label="Company"
          value={state.company}
          onChangeText={handlers.setCompany}
          animation={animations.slideAnimation}
        />
      )}
      {state.showPassword && !state.isGoogleSignIn && (
        <PasswordInput
          value={state.password}
          onChangeText={handlers.setPassword}
          animation={animations.slideAnimation}
          navigation={navigation}
        />
      )}
    </View>
  );
};
