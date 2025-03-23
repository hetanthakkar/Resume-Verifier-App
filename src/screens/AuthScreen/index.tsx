import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  Text,
} from 'react-native';
import styles from './styles';
import {Header} from './components/Header';
import {LoginForm} from './components/LoginForm';
import {OTPVerification} from './components/OTPVerification';
import {SubmitButton} from './components/SubmitButton';
import {useLoginScreen} from './hooks/useLoginScreen';
import {LottieSection} from './components/LottieSection';

const LoginScreen = ({route, navigation}) => {
  const {state, handlers, animations, refs} = useLoginScreen(route, navigation);
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          ref={refs.scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <Header navigation={navigation} />
          {state.showLottie && (
            <LottieSection
              lottieRef={refs.lottieRef}
              opacity={animations.lottieOpacity}
            />
          )}
          <LoginForm
            state={state}
            handlers={handlers}
            animations={animations}
            navigation={navigation}
          />
          {state.showOTP && (
            <OTPVerification
              state={state}
              handlers={handlers}
              animations={animations}
              refs={refs.otpRefs}
            />
          )}
        </ScrollView>
        <SubmitButton
          state={state}
          handlers={handlers}
          animations={animations.buttonScale}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
