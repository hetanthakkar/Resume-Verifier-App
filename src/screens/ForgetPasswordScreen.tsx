import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

const RecruiterForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [resetSent, setResetSent] = useState<boolean>(false);

  const handleResetPassword = () => {
    // Implement password reset logic here
    console.log('Reset password for:', email);
    setResetSent(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Forgot Password</Text>
      <Image
        source={{
          uri: 'https://www.southwestsearch.net/wp-content/uploads/2018/09/careerbuilder-ar_post-451.jpg',
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Reset Your Password</Text>
        <Text style={styles.subText}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>
      </View>

      {!resetSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>
            Password reset instructions have been sent to your email address.
          </Text>
          <Text style={styles.confirmationSubText}>
            Please check your inbox and follow the instructions to reset your
            password.
          </Text>
        </View>
      )}

      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
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
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  confirmationContainer: {
    backgroundColor: '#e6f3ff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  link: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecruiterForgotPassword;
