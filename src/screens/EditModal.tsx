import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  rightIcon?: string;
  colors: string[];
  onPress?: () => void;
}

interface ProfileData {
  name: string;
  email: string;
  company: string;
}

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  value: string;
  title: string;
  field: 'name' | 'company' | 'email';
}
const API_BASE_URL = 'http://localhost:8000/api';

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  value,
  title,
  field,
}) => {
  const [newValue, setNewValue] = useState(value);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    setNewValue(value);
    setOtp('');
    setOtpSent(false);
  }, [visible, value]);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('accessToken');

    if (field === 'email') {
      if (!otpSent) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/profile/update-email/request/`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Add this header
              },
              body: JSON.stringify({new_email: newValue}), // Ensure newValue is defined
            },
          );

          if (response.ok) {
            setOtpSent(true);
          } else {
            const data = await response.json();
            Alert.alert(
              'Error',
              data.message || 'Failed to send verification code',
            );
          }
        } catch (error) {
          Alert.alert('Error', 'Network error. Please try again.');
        }
      } else {
        try {
          const response = await fetch(
            `${API_BASE_URL}/profile/update-email/confirm/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                // Add your authentication header here
              },
              body: JSON.stringify({
                new_email: newValue,
                otp: otp,
              }),
            },
          );

          if (response.ok) {
            onSave(newValue);
            onClose();
          } else {
            const data = await response.json();
            Alert.alert('Error', data.message || 'Failed to verify code');
          }
        } catch (error) {
          Alert.alert('Error', 'Network error. Please try again.');
        }
      }
    } else {
      onSave(newValue);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.modalInput}
            value={newValue}
            onChangeText={setNewValue}
            autoCapitalize="none"
            keyboardType={field === 'email' ? 'email-address' : 'default'}
          />
          {field === 'email' && otpSent && (
            <TextInput
              style={styles.modalInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter verification code"
              keyboardType="number-pad"
              maxLength={6}
            />
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.modalButton, styles.modalButtonPrimary]}>
              <Text style={styles.modalButtonTextPrimary}>
                {field === 'email' && !otpSent ? 'Send Code' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    color: '#1E1E1E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowContent: {
    flex: 1,
    marginLeft: 16,
  },
  rowLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginTop: 8,
  },
  logoutSection: {
    marginTop: 'auto',
    marginBottom: 24,
  },
});
const extraStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E1E1E',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 12,
    marginLeft: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    color: 'white',
  },
});
const styles = StyleSheet.create({
  ...styles1,
  ...extraStyles,
});

export default EditModal;
