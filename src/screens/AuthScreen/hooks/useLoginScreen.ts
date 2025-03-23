import {useState, useRef, useEffect} from 'react';
import {Animated, Alert} from 'react-native';
import {useAuthHandlers} from './useAuthHandlers';
import {useAnimations} from './useAnimations';

export const useLoginScreen = (route, navigation) => {
  const googleUser = route.params?.googleUser;
  const isGoogleSignIn = route.params?.isGoogleSignIn;

  const [state, setState] = useState({
    email: googleUser?.email || '',
    name: googleUser?.name || '',
    company: '',
    password: '',
    confirmedEmail: '',
    showOTP: false,
    showPassword: !isGoogleSignIn,
    showName: isGoogleSignIn,
    showCompany: isGoogleSignIn,
    showCategory: false,
    selectedCategory: '',
    otp: ['', '', '', '', '', ''],
    showLottie: !isGoogleSignIn,
    isOTPComplete: false,
    isLoading: false,
    isNewUser: isGoogleSignIn === true,
    isGoogleSignIn,
  });

  const refs = {
    otpRefs: useRef([]),
    lottieRef: useRef(null),
    scrollViewRef: useRef(null),
  };

  const animations = useAnimations(isGoogleSignIn);
  const handlers = useAuthHandlers(
    state,
    setState,
    animations,
    navigation,
    refs,
  );

  useEffect(() => {
    if (refs.lottieRef.current && !isGoogleSignIn) {
      refs.lottieRef.current.play();
    }
  }, []);

  return {state, handlers, animations, refs};
};
