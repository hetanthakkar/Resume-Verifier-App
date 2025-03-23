import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../../utils/constants';

export const useAuthHandlers = (
  state,
  setState,
  animations,
  navigation,
  refs,
) => {
  const handleEmailChange = (text: string) => {
    setState(prev => ({
      ...prev,
      email: text.trim(),
      showPassword: false,
    }));

    if (state.showOTP) {
      animations.animateTransition(false);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOTP = [...state.otp];
    newOTP[index] = text;

    setState(prev => ({
      ...prev,
      otp: newOTP,
      isOTPComplete: newOTP.every(digit => digit.length === 1),
    }));
    console.log('aoisdnf', refs);
    if (text && index < 5) {
      refs.otpRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      refs.otpRefs.current[index - 1]?.focus();
    }
    // Auto-focus next input or go back
  };

  const handleContinue = async () => {
    if (!state.email || state.isLoading) return;
    setState(prev => ({...prev, isLoading: true}));

    try {
      const isRegistered = await checkEmailRegistration(state.email);
      animations.fadeOutLottie(() =>
        setState(prev => ({...prev, showLottie: false})),
      );

      setState(prev => ({
        ...prev,
        showPassword: true,
        isNewUser: !isRegistered,
        showName: !isRegistered,
        showCompany: !isRegistered,
      }));

      animations.animateTransition1(true);
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const handleSubmit = async () => {
    if (!state.email || !state.name || !state.company || !state.selectedCategory || state.isLoading)
      return;
    setState(prev => ({...prev, isLoading: true}));

    try {
      const response = await fetch(`${API_URL}/api/auth/update-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.googleUser?.accessToken}`,
        },
        body: JSON.stringify({
          name: state.name,
          company: state.company,
          problemCategory: state.selectedCategory,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await saveUserData(data);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.error || 'Update failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const handleLogin = async () => {
    if (!state.email || !state.password || state.isLoading) return;
    setState(prev => ({...prev, isLoading: true}));

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: state.email,
          password: state.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await saveUserData(data);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const handleSubmitOTP = async () => {
    if (!state.isOTPComplete || state.isLoading) return;
    setState(prev => ({...prev, isLoading: true}));

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: state.confirmedEmail,
          otp: parseInt(state.otp.join('')),
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
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const handleRegister = async () => {
    if (
      !state.email ||
      !state.name ||
      !state.company ||
      !state.selectedCategory || // Require category selection
      !state.password ||
      state.isLoading
    )
      return;
    setState(prev => ({...prev, isLoading: true}));

    try {
      const response = await fetch(`${API_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          name: state.name,
          company: state.company,
          problemCategory: state.selectedCategory, // Send category to the API
        }),
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          confirmedEmail: state.email,
          showPassword: false,
          showName: false,
          showCompany: false,
          showOTP: true,
        }));
        animations.animateTransition(true);
      } else {
        const data = await response.json();
        Alert.alert('Error', data.email?.[0] || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    } finally {
      setState(prev => ({...prev, isLoading: false}));
    }
  };

  const saveUserData = async data => {
    await AsyncStorage.setItem('accessToken', data.access);
    await AsyncStorage.setItem('refreshToken', data.refresh);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
  };

  const checkEmailRegistration = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check-email/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };
  const setName = (text: string) => {
    setState(prev => ({
      ...prev,
      name: text,
    }));
  };

  const setCompany = (text: string) => {
    setState(prev => ({
      ...prev,
      company: text,
      // Show category picker after user enters description
      showCategory: text.length > 0
    }));
  };
  
  const setCategory = (categoryId: string) => {
    setState(prev => ({
      ...prev,
      selectedCategory: categoryId,
    }));
  };

  const setPassword = (text: string) => {
    setState(prev => ({
      ...prev,
      password: text,
    }));
  };

  return {
    handleEmailChange,
    handleOTPChange,
    handleContinue,
    handleSubmit,
    handleLogin,
    handleRegister,
    setName,
    setCompany,
    setCategory,
    setPassword,
    handleSubmitOTP,
  };
};
