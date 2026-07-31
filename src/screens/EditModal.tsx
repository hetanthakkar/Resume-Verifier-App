import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  value: string;
  title: string;
  field: 'name' | 'company' | 'email';
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  value,
  title,
  field,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const { theme } = useTheme();

  const handleSave = () => {
    if (inputValue.trim()) {
      onSave(inputValue.trim());
      onClose();
    }
  };

  const getPlaceholder = () => {
    switch (field) {
      case 'name':
        return 'Enter your name';
      case 'email':
        return 'Enter your email';
      case 'company':
        return 'Enter your company';
      default:
        return 'Enter value';
    }
  };

  const getKeyboardType = () => {
    switch (field) {
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{title}</Text>
          
          <TextInput
            style={[
              styles.modalInput,
              {
                backgroundColor: theme.colors.input,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={getPlaceholder()}
            placeholderTextColor={theme.colors.textTertiary}
            autoCapitalize={field === 'name' ? 'words' : 'none'}
            keyboardType={getKeyboardType()}
            autoFocus
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              onPress={onClose} 
              style={[styles.modalButton, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.modalButtonTextPrimary}>Save</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    // backgroundColor will be set dynamically
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default EditModal;