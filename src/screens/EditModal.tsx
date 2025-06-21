import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

const API_BASE_URL = 'http://localhost:8000/api';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOTP = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Forgot password request response:', data);
        setOtpSent(true);
        Alert.alert('Success', 'Verification code has been sent to your email');
      } else {
        const data = await response.json();
        console.log('Forgot password request error:', data);
        Alert.alert('Error', data.message || 'Failed to send verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            otp,
            new_password: newPassword,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Password reset response:', data);
        Alert.alert('Success', 'Password has been reset successfully');
        onClose();
      } else {
        const data = await response.json();
        console.log('Password reset error:', data);
        Alert.alert('Error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reset Password</Text>
          
          <TextInput
            style={styles.modalInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {otpSent && (
            <>
              <TextInput
                style={styles.modalInput}
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter verification code"
                keyboardType="number-pad"
                maxLength={6}
              />
              <TextInput
                style={styles.modalInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
            </>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={otpSent ? handleResetPassword : handleRequestOTP}
              style={[styles.modalButton, styles.modalButtonPrimary]}>
              <Text style={styles.modalButtonTextPrimary}>
                {otpSent ? 'Reset Password' : 'Send Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    textAlign: 'center',
    color: '#333',
  },
  modalButtonTextPrimary: {
    textAlign: 'center',
    color: 'white',
  },
});

export default ForgotPasswordModal;