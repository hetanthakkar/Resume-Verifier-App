import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const RecruiterSignup: React.FC = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOTP] = useState<string[]>(['', '', '', '']);
  const [isOTPComplete, setIsOTPComplete] = useState<boolean>(false);
  
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const otpOpacity = useRef(new Animated.Value(0)).current;

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
    ]).start(() => {
      setShowOTP(show);
      if (!show) {
        setOTP(['', '', '', '']);
      }
    });
  };

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    if (email && password && fullName) {
      animateTransition(true);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);

    if (text && index < 3) {
      otpRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    const isComplete = newOTP.every((digit) => digit.length === 1);
    setIsOTPComplete(isComplete);
  };

  const handleSubmitOTP = () => {
    if (isOTPComplete) {
      // Here you would typically verify the OTP with your backend
      navigation.navigate('Home');
    }
  };

  const handleResendOTP = () => {
    // Implement OTP resend logic
    console.log('Resending OTP to:', email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F0F0F3']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!showOTP ? (
            <>
              <View style={styles.header}>
                <Text style={styles.headerText}>Create Account</Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.subText}>Sign up to get started</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignUp}>
                  <LinearGradient
                    colors={['#007AFF', '#0056B3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.loginTextContainer}
                  onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginTextBold}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Animated.View
              style={[
                styles.otpContainer,
                {
                  opacity: otpOpacity,
                  transform: [
                    {
                      translateY: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={styles.otpHeader}>
                <Text style={styles.headerText}>Verify your email</Text>
                <Text style={styles.otpSubText}>
                  Enter the 4-digit code sent to{'\n'}{email}
                </Text>
              </View>

              <View style={styles.otpInputsContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => otpRefs.current[index] = ref}
                    style={[styles.otpInput, digit && styles.otpInputFilled]}
                    maxLength={1}
                    keyboardType="numeric"
                    value={digit}
                    onChangeText={(text) => handleOTPChange(text, index)}
                  />
                ))}
              </View>

              {isOTPComplete && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmitOTP}>
                  <LinearGradient
                    colors={['#007AFF', '#0056B3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subText: {
    fontSize: 16,
    color: '#3A3A3C',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: -20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#1C1C1E',
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
  },
  loginText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loginTextBold: {
    fontWeight: 'bold',
  },
  loginTextContainer: {
    marginTop: 10,
  },
  // OTP specific styles
  otpContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpSubText: {
    fontSize: 16,
    color: '#3A3A3C',
    textAlign: 'center',
    marginTop: 10,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#1C1C1E',
  },
  otpInputFilled: {
    backgroundColor: '#F0F0F3',
    borderColor: '#007AFF',
  },
  resendButton: {
    marginTop: 20,
    padding: 10,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RecruiterSignup;