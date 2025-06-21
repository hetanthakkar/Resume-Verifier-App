import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import styles from './styles';

const AuthScreen = ({route, navigation}) => {
  const googleUser = route.params?.googleUser;
  const isGoogleSignIn = route.params?.isGoogleSignIn;

  const [email, setEmail] = useState(googleUser?.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(googleUser?.name || '');
  const [company, setCompany] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(isGoogleSignIn);
  const [showSignupFields, setShowSignupFields] = useState(false);

  // Create refs for OTP inputs
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleEmailChange = (text: string) => {
    setEmail(text.trim());
  };

  const handleContinue = async () => {
    if (!email || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/check-email/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      
      const isRegistered = response.status === 200;
      setIsNewUser(!isRegistered);
      
      if (isRegistered) {
        // User exists, show password field for login
        setShowSignupFields(false);
        setShowOTP(false);
      } else {
        // New user, show registration fields
        setShowSignupFields(true);
        setShowOTP(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !name || !company || !password || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, name, company}),
      });

      if (response.ok) {
        setShowOTP(true);
        setShowSignupFields(false);
      } else {
        const data = await response.json();
        Alert.alert('Error', data.email?.[0] || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    // Only allow numeric input
    if (!/^\d*$/.test(text)) return;
    
    const newOTP = [...otp];
    
    // Handle backspace - if text is empty and we're deleting
    if (text === '' && newOTP[index] !== '') {
      newOTP[index] = '';
      setOtp(newOTP);
      
      // Move focus to previous input if available
      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
      return;
    }
    
    // Handle normal input - only allow single digits
    if (text.length > 1) {
      text = text.slice(-1); // Take only the last character
    }
    
    newOTP[index] = text;
    setOtp(newOTP);
    
    // Auto-focus next input if we have a digit and there's a next input
    if (text && index < 5) {
      setTimeout(() => {
        otpRefs.current[index + 1]?.focus();
      }, 100);
    }
  };

  const handleOTPKeyPress = (e, index) => {
    // Handle backspace key press
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // If current field is empty and backspace is pressed, go to previous field
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmitOTP = async () => {
    if (otp.some(digit => !digit) || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email,
          otp: parseInt(otp.join('')),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    if (!name || !company || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/update-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${googleUser?.accessToken}`,
        },
        body: JSON.stringify({name, company}),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('refreshToken', data.refresh);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.error || 'Update failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (showOTP) {
      return (
        <View style={styles.otpSection}>
          <Text style={styles.verifyTitle}>Verify your email</Text>
          <Text style={styles.subText}>
            Enter the 6-digit code sent to {email}
          </Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (otpRefs.current[index] = ref)}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={text => handleOTPChange(text, index)}
                onKeyPress={e => handleOTPKeyPress(e, index)}
                editable={!isLoading}
                autoFocus={index === 0}
                selectTextOnFocus={true}
                textContentType="oneTimeCode"
              />
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="name@company.com"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        {isGoogleSignIn && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                style={styles.input}
                value={company}
                onChangeText={setCompany}
                placeholder="Enter your company"
                editable={!isLoading}
              />
            </View>
          </>
        )}

        {!isGoogleSignIn && (
          <>
            {/* Show password field for existing users */}
            {!isNewUser && !showSignupFields && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
                <TouchableOpacity
                  style={styles.switchModeButton}
                  onPress={() => {
                    setShowSignupFields(true);
                    setIsNewUser(true);
                    setPassword('');
                  }}>
                  <Text style={styles.switchModeText}>
                    Don't have an account? Sign up
                  </Text>
                </TouchableOpacity>
              </>
            )}
            
            {/* Show signup fields for new users */}
            {showSignupFields && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    editable={!isLoading}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Company</Text>
                  <TextInput
                    style={styles.input}
                    value={company}
                    onChangeText={setCompany}
                    placeholder="Enter your company"
                    editable={!isLoading}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>
                <TouchableOpacity
                  style={styles.switchModeButton}
                  onPress={() => {
                    setShowSignupFields(false);
                    setIsNewUser(false);
                    setName('');
                    setCompany('');
                    setPassword('');
                  }}>
                  <Text style={styles.switchModeText}>
                    Already have an account? Login
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    );
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (showOTP) return 'Verify OTP';
    if (isGoogleSignIn) return 'Continue';
    if (showSignupFields) return 'Sign Up';
    if (!isNewUser && !showSignupFields) return 'Login';
    return 'Continue';
  };

  const handleButtonPress = () => {
    if (showOTP) return handleSubmitOTP();
    if (isGoogleSignIn) return handleGoogleSubmit();
    if (showSignupFields) return handleRegister();
    if (!isNewUser && !showSignupFields && password) return handleLogin();
    return handleContinue();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text>← Back</Text>
            </TouchableOpacity>
          </View>

          {renderForm()}
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.button, isLoading && {opacity: 0.7}]}
            onPress={handleButtonPress}
            disabled={isLoading}>
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{getButtonText()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
