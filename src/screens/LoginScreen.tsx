import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import GradientText from './gradienttext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
interface LoginScreenProps {
  navigation: any;
}

const {width, height} = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({route, navigation}) => {
  // State management
  const googleUser = route.params?.googleUser;
  const isGoogleSignIn = route.params?.isGoogleSignIn;

  // State management
  const [email, setEmail] = useState<string>(googleUser?.email || '');
  const [name, setName] = useState<string>(googleUser?.name || '');
  const [company, setCompany] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedEmail, setConfirmedEmail] = useState<string>('');
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(!isGoogleSignIn);
  const [showName, setShowName] = useState<boolean>(isGoogleSignIn);
  const [showCompany, setShowCompany] = useState<boolean>(isGoogleSignIn);
  const [otp, setOTP] = useState<string[]>(['', '', '', '', '', '']);
  const [showLottie, setShowLottie] = useState<boolean>(!isGoogleSignIn);
  const [isOTPComplete, setIsOTPComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(
    isGoogleSignIn === true ? true : false,
  );
  const API_URL = Platform.select({
    ios: 'http://localhost:8000',
    android: 'http://10.0.2.2:8000', // Android emulator localhost equivalent
  });
  // Refs
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const lottieRef = useRef<LottieView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animations
  const slideAnimation = useRef(
    new Animated.Value(isGoogleSignIn ? 1 : 0),
  ).current;
  const otpOpacity = useRef(new Animated.Value(0)).current;
  const lottieOpacity = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (lottieRef.current && !isGoogleSignIn) {
      lottieRef.current.play();
    }
  }, []);
  // Animation handlers
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
        setOTP(['', '', '', '', '', '']);
      }
    });
  };
  const animateTransition1 = (show: boolean) => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {});
  };

  const animateButton = (pressed: boolean) => {
    Animated.spring(buttonScale, {
      toValue: pressed ? 0.95 : 1,
      useNativeDriver: true,
    }).start();
  };

  // Input handlers
  const handleEmailChange = (text: string) => {
    setEmail(text.trim());
    setShowPassword(false);
    if (showOTP) {
      animateTransition(false);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);

    // Auto-focus next input
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    // Check if OTP is complete
    const isComplete = newOTP.every(digit => digit.length === 1);
    setIsOTPComplete(isComplete);
  };
  const handleSubmit = async () => {
    console.log('handle submit', email);
    if (!email || !name || !company || isLoading) return;
    setIsLoading(true);

    try {
      // Just update the user info
      const response = await fetch(`${API_URL}/api/auth/update-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${googleUser?.accessToken}`,
        },
        body: JSON.stringify({
          name,
          company,
        }),
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
      console.error('Error:', error);
      Alert.alert('Error', 'Update failed');
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
        body: JSON.stringify({
          email,
          password,
          name,
          company,
        }),
      });

      if (response.ok) {
        setConfirmedEmail(email);
        setShowPassword(false);
        setShowName(false);
        setShowCompany(false);
        animateTransition(true); // Show OTP screen
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

  const handleContinue = async () => {
    console.log('email', email);
    if (!email || isLoading) return;
    setIsLoading(true);

    try {
      const isRegistered = await checkEmailRegistration(email);

      Animated.timing(lottieOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowLottie(false));

      if (isRegistered) {
        console.log('isRegistered', isRegistered);
        setShowPassword(true);
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
        setShowPassword(true);
        setShowName(true);
        setShowCompany(true);
      }
      animateTransition1(true);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailRegistration = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check-email/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      console.log('cCheck email', response);

      return response.status === 200;
    } catch (error) {
      console.error('cCheck Error checking email:', error, email);
      return false;
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
      console.error('Error:', error);
      Alert.alert('Error', 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOTP = async () => {
    if (!isOTPComplete || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: confirmedEmail,
          otp: parseInt(otp.join('')),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store tokens and user data
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <IonIcons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <GradientText text={'Welcome to Skill Verify'} fontSize={24} />
            </View>
          </View>

          {showLottie && (
            <Animated.View
              style={[styles.lottieContainer, {opacity: lottieOpacity}]}>
              <LottieView
                ref={lottieRef}
                source={require('../../assets/animation.json')}
                style={styles.lottieAnimation}
                autoPlay
                loop
              />
            </Animated.View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter Your Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={handleEmailChange}
                placeholder="name@company.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
              {isGoogleSignIn && (
                <Text style={styles.googleEmailNote}>
                  Email provided by Google Sign-in
                </Text>
              )}
            </View>

            {showName && (
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    opacity: slideAnimation,
                    transform: [
                      {
                        translateY: slideAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#A0AEC0"
                  editable={!isLoading}
                />
              </Animated.View>
            )}

            {showCompany && (
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    opacity: slideAnimation,
                    transform: [
                      {
                        translateY: slideAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Enter your company name"
                  placeholderTextColor="#A0AEC0"
                  editable={!isLoading}
                />
              </Animated.View>
            )}

            {showPassword && !isGoogleSignIn && (
              <Animated.View
                style={[
                  styles.inputContainer,
                  {
                    opacity: slideAnimation,
                    transform: [
                      {
                        translateY: slideAnimation.interpolate({
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
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}
                  disabled={isLoading}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            {showOTP && (
              <Animated.View
                style={[
                  styles.otpSection,
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
                  <Text style={styles.verifyTitle}>Verify your email</Text>
                  <Text style={styles.subText}>
                    Enter the 6-digit code sent to {confirmedEmail}
                  </Text>
                </View>

                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (otpRefs.current[index] = ref)}
                      style={[styles.otpInput, digit && styles.otpInputFilled]}
                      maxLength={1}
                      keyboardType="numeric"
                      value={digit}
                      onChangeText={text => handleOTPChange(text, index)}
                      editable={!isLoading}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.resendButton}
                  disabled={isLoading}>
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={() => animateButton(true)}
            onPressOut={() => animateButton(false)}
            // onPress={isGoogleSignIn ? handleSubmit : handleLogin}
            onPress={
              isGoogleSignIn
                ? handleSubmit
                : showPassword
                ? isNewUser
                  ? handleRegister
                  : handleLogin
                : showOTP
                ? handleSubmitOTP
                : handleContinue
            }
            disabled={isLoading}>
            <Animated.View
              style={[styles.button, {transform: [{scale: buttonScale}]}]}>
              <LinearGradient
                colors={['#007AFF', '#0056B3']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonGradient}>
                <Text style={styles.buttonText}>
                  {isLoading
                    ? 'Please wait...'
                    : isGoogleSignIn
                    ? 'Complete Registration'
                    : 'Continue'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1A1A1A',
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.3,
    marginVertical: 20,
  },
  lottieAnimation: {
    width: width * 0.7,
    height: width * 0.7,
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    color: '#2D3748',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  forgotPasswordButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  otpSection: {
    marginTop: 24,
  },
  otpHeader: {
    marginBottom: 24,
  },
  verifyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: width * 0.13,
    height: width * 0.13,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  otpInputFilled: {
    backgroundColor: '#EDF2F7',
    borderColor: '#4A5568',
  },
  resendButton: {
    alignSelf: 'center',
    padding: 12,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: 'white',
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    marginLeft: 200,
  },

  titleContainer: {
    marginLeft: -20,
  },
  subtitleText: {
    fontSize: 16,
    // color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: -18,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

export default LoginScreen;
