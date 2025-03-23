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
  ActivityIndicator,
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
  field: 'name' | 'company' | 'email' | 'problem';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewValue(value);
    setOtp('');
    setOtpSent(false);
    setLoading(false);
  }, [visible, value]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (field === 'problem' && !newValue.trim()) {
        Alert.alert('Error', 'Problem description cannot be empty');
        return;
      }

      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('Error', 'You need to be logged in');
        return;
      }

      if (field === 'email') {
        if (!otpSent) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/profile/update-email/request/`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newValue }),
              },
            );

            const data = await response.json();
            
            if (response.ok) {
              setOtpSent(true);
              Alert.alert('Success', data.message || 'Verification code sent to your new email');
            } else {
              Alert.alert(
                'Error',
                typeof data.error === 'string' 
                  ? data.error 
                  : 'Failed to send verification code',
              );
            }
          } catch (error) {
            console.error('Error sending verification code:', error);
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
                },
                body: JSON.stringify({
                  email: newValue,
                  otp: otp,
                }),
              },
            );

            const data = await response.json();

            if (response.ok) {
              await onSave(newValue);
              Alert.alert('Success', data.message || 'Email updated successfully');
              onClose();
            } else {
              Alert.alert(
                'Error',
                typeof data.error === 'string'
                  ? data.error
                  : 'Failed to verify code',
              );
            }
          } catch (error) {
            console.error('Error confirming email update:', error);
            Alert.alert('Error', 'Network error. Please try again.');
          }
        }
      } else {
        await onSave(newValue);
        onClose();
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert(
        'Error',
        'An error occurred while saving. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {field === 'problem' ? (
            <TextInput
              style={[styles.modalInput, styles.problemInput]}
              value={newValue}
              onChangeText={setNewValue}
              multiline
              numberOfLines={4}
              placeholder="Describe your problem..."
              textAlignVertical="top"
            />
          ) : (
            <TextInput
              style={styles.modalInput}
              value={newValue}
              onChangeText={setNewValue}
              autoCapitalize="none"
              keyboardType={field === 'email' ? 'email-address' : 'default'}
            />
          )}
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
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.modalButton}
              disabled={loading}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.modalButton,
                styles.modalButtonPrimary,
                loading && styles.modalButtonDisabled,
              ]}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>
                  {field === 'email' && !otpSent ? 'Send Code' : 'Save'}
                </Text>
              )}
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
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    color: 'white',
  },
  problemInput: {
    height: 120,
    textAlignVertical: 'top',
  },
});
const styles = StyleSheet.create({
  ...styles1,
  ...extraStyles,
});

export default EditModal;
