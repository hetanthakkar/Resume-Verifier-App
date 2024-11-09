import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

type OTPInputRef = TextInput | null;

const RecruiterLogin: React.FC = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOTP] = useState<string[]>(['', '', '', '']);

  const otpRefs = useRef<OTPInputRef[]>([]);

  const handleSignIn = (): void => {
    navigation.navigate("Home")
    if (email && !showOTP) {
      setShowOTP(true);
      navigation.navigate("Home")
    } else if (showOTP && otp.every(digit => digit !== '')) {
      console.log('OTP submitted:', otp.join(''));
      navigation.navigate("Home")
    }
  };

  const handleResendOTP = (): void => {
    console.log('Resending OTP...');
  };

  const handleOTPChange = (text: string, index: number): void => {
    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);

    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Recruiter Login</Text>
      <Image
        source={{
          uri: 'https://www.southwestsearch.net/wp-content/uploads/2018/09/careerbuilder-ar_post-451.jpg',
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Sign in to continue</Text>
      </View>

      {!showOTP ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.otpInstructions}>
            Enter the 4-digit OTP sent to your email
          </Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (otpRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={text => handleOTPChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {/* <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
        <Text style={styles.socialButtonText}>Sign in with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
        <Text style={styles.socialButtonText}>Sign in with Google</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 30,
    borderRadius: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: 'white',
    elevation: 2,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  otpInstructions: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    fontSize: 14,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    width: '22%',
    textAlign: 'center',
    backgroundColor: 'white',
    elevation: 2,
    fontSize: 18,
    color: '#333',
  },
  resendText: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
});

export default RecruiterLogin;
