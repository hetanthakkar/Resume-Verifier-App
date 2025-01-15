import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ForgotPasswordState {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  step: 'email' | 'otp' | 'success';
}

const API_BASE_URL = 'http://localhost:8000/api';
const BLUE_GRADIENT = ['#45AAF2', '#2D98DA'];

const ForgotPasswordScreens: React.FC = () => {
  const navigation = useNavigation();
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    step: 'email',
  });

  const handleRequestReset = async () => {
    if (!state.email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setState(prev => ({...prev, isLoading: true}));
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: state.email}),
      });

      if (response.ok) {
        setState(prev => ({...prev, step: 'otp'}));
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to send reset code');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const handleResetPassword = async () => {
    if (state.newPassword !== state.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setState(prev => ({...prev, isLoading: true}));
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: state.email,
          otp: state.otp,
          new_password: state.newPassword,
        }),
      });

      if (response.ok) {
        setState(prev => ({...prev, step: 'success'}));
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const renderEmailStep = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={state.email}
        onChangeText={email => setState(prev => ({...prev, email}))}
        keyboardType="email-address"
        placeholderTextColor="#A0AEC0"
        editable={!state.isLoading}
        autoCapitalize="none"
      />
      <LinearGradient colors={BLUE_GRADIENT} style={styles.buttonGradient}>
        <TouchableOpacity
          style={[styles.button, state.isLoading && styles.buttonDisabled]}
          onPress={handleRequestReset}
          disabled={state.isLoading}>
          {state.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Code</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.formContainer}>
      <Text style={styles.otpMessage}>
        Please enter the verification code sent to {state.email}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        value={state.otp}
        onChangeText={otp => setState(prev => ({...prev, otp}))}
        keyboardType="number-pad"
        maxLength={6}
        placeholderTextColor="#A0AEC0"
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={state.newPassword}
        onChangeText={newPassword => setState(prev => ({...prev, newPassword}))}
        secureTextEntry
        placeholderTextColor="#A0AEC0"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={state.confirmPassword}
        onChangeText={confirmPassword =>
          setState(prev => ({...prev, confirmPassword}))
        }
        secureTextEntry
        placeholderTextColor="#A0AEC0"
      />
      <LinearGradient colors={BLUE_GRADIENT} style={styles.buttonGradient}>
        <TouchableOpacity
          style={[styles.button, state.isLoading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={state.isLoading}>
          {state.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.successIconContainer}>
        <Text style={styles.successIcon}>✓</Text>
      </View>
      <Text style={styles.confirmationText}>Password Reset Successful!</Text>
      <Text style={styles.confirmationSubText}>
        Your password has been successfully reset. You can now log in with your
        new password.
      </Text>
      <LinearGradient colors={BLUE_GRADIENT} style={styles.buttonGradient}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Forgot Password</Text>
        <Text style={styles.subText}>
          {state.step === 'email'
            ? "Enter your email address and we'll send you a verification code."
            : state.step === 'otp'
            ? 'Enter the verification code and your new password.'
            : 'Password reset complete!'}
        </Text>
      </View>

      {state.step === 'email' && renderEmailStep()}
      {state.step === 'otp' && renderOtpStep()}
      {state.step === 'success' && renderSuccessStep()}

      {state.step !== 'success' && (
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  headerContainer: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  formContainer: {
    padding: 24,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#2D3748',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonGradient: {
    borderRadius: 12,
    marginTop: 8,
  },
  button: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  otpMessage: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 24,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 24,
  },
  confirmationContainer: {
    margin: 24,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#45AAF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    color: 'white',
    fontSize: 32,
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  confirmationSubText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  linkContainer: {
    alignItems: 'center',
    padding: 24,
  },
  link: {
    color: '#45AAF2',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreens;
