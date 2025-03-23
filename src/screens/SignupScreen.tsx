import React, {useState, useRef} from 'react';
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
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {authAPI} from '../services/api';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const {width: screenWidth} = Dimensions.get('window');

const RecruiterSignup: React.FC<SignupScreenProps> = ({navigation}) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [problemCategory, setProblemCategory] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOTP] = useState<string[]>(['', '', '', '']);
  const [isOTPComplete, setIsOTPComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (
      !email ||
      !password ||
      !fullName ||
      !problemCategory ||
      !problemDescription
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.register({
        email,
        username: fullName.replace(/\s+/g, '_').toLowerCase(),
        password,
        problem_category: problemCategory,
        problem_description: problemDescription,
      });
      animateTransition(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Registration failed',
      );
    } finally {
      setIsLoading(false);
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

    const isComplete = newOTP.every(digit => digit.length === 1);
    setIsOTPComplete(isComplete);
  };

  const handleSubmitOTP = async () => {
    if (!isOTPComplete) return;

    setIsLoading(true);
    try {
      await authAPI.verifyOTP({
        email,
        otp: otp.join(''),
      });
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'OTP verification failed',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await authAPI.register({
        email,
        username: fullName,
        password,
        problem_category: problemCategory,
        problem_description: problemDescription,
      });
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to resend OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F0F0F3']} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!showOTP ? (
            <>
              <View style={styles.header}>
                <Text style={styles.headerText}>Create Account</Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.subText}>Sign up to get started</Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
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
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateButtonText}>
                      {dateOfBirth.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
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
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="medical-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Problem Category (e.g., anxiety, depression)"
                    value={problemCategory}
                    onChangeText={setProblemCategory}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#007AFF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your problem in detail"
                    value={problemDescription}
                    onChangeText={setProblemDescription}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#999"
                  />
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSignUp}
                  disabled={isLoading}>
                  <LinearGradient
                    colors={['#007AFF', '#0056B3']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Signing up...' : 'Sign Up'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginTextContainer}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text style={styles.loginTextBold}>Log in</Text>
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
                  Enter the 4-digit code sent to{'\n'}
                  {email}
                </Text>
              </View>

              <View style={styles.otpInputsContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (otpRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : null,
                    ]}
                    maxLength={1}
                    keyboardType="numeric"
                    value={digit}
                    onChangeText={text => handleOTPChange(text, index)}
                  />
                ))}
              </View>

              {isOTPComplete && (
                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSubmitOTP}
                  disabled={isLoading}>
                  <LinearGradient
                    colors={['#007AFF', '#0056B3']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={isLoading}>
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
    backgroundColor: 'white',
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
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  dateButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  otpContainer: {
    padding: 20,
    alignItems: 'center',
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  otpInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default RecruiterSignup;
