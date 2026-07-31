import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (comment: string, annotationData: any) => void;
  annotationData?: any;
  existingComment?: string;
  isLoading?: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  onSave,
  annotationData,
  existingComment = '',
  isLoading = false,
}) => {
  const [comment, setComment] = useState(existingComment);

  useEffect(() => {
    if (visible) {
      setComment(existingComment);
    }
  }, [visible, existingComment]);

  const handleSave = () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }
    onSave(comment.trim(), annotationData);
  };

  const handleCancel = () => {
    setComment(existingComment);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {existingComment ? 'Edit Comment' : 'Add Comment'}
            </Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Comment:</Text>
            <TextInput
              style={styles.textInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Enter your comment here..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />

            {annotationData && (
              <View style={styles.annotationInfo}>
                <Text style={styles.annotationLabel}>Annotation Details:</Text>
                <Text style={styles.annotationText}>
                  Page: {annotationData.pageNumber || 'N/A'}
                </Text>
                {annotationData.rect && annotationData.rect.x1 !== undefined && (
                  <Text style={styles.annotationText}>
                    Position: ({annotationData.rect.x1.toFixed(2)}, {annotationData.rect.y1.toFixed(2)}) - ({annotationData.rect.x2.toFixed(2)}, {annotationData.rect.y2.toFixed(2)})
                  </Text>
                )}
                {(!annotationData.rect || annotationData.rect.x1 === undefined) && (
                  <Text style={styles.annotationText}>
                    Position: No coordinates available
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isLoading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#F9F9F9',
  },
  annotationInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  annotationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  annotationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CommentModal; 