import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import CommentsList from '../components/CommentsList';
import CommentModal from '../components/CommentModal';

const API_BASE_URL = 'http://localhost:8000/api';

interface Comment {
  id: string;
  text: string;
  pageNumber: number;
  rect?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  created_at: string;
  created_by?: string;
}

const CommentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {resumeId, jobId, onNavigateToAnnotation} = route.params as any;
  
  // Debug: Log route parameters
  console.log('CommentsScreen route params:', route.params);
  console.log('resumeId:', resumeId);
  console.log('jobId:', jobId);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [currentAnnotationData, setCurrentAnnotationData] = useState<any>(null);

  useEffect(() => {
    if (resumeId) {
      fetchComments();
    }
  }, [resumeId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        `${API_BASE_URL}/resumes/${resumeId}/comments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComment = async (commentText: string, annotationData: any) => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('accessToken');
      
      const commentData = {
        text: commentText,
        page_number: annotationData?.pageNumber || 1,
        rect: annotationData?.rect || {},
        resume_id: resumeId,
        job_id: jobId,
      };

      const url = editingComment
        ? `${API_BASE_URL}/comments/${editingComment.id}/`
        : `${API_BASE_URL}/comments/`;

      const method = editingComment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const savedComment = await response.json();
        
        if (editingComment) {
          setComments(prev =>
            prev.map(comment =>
              comment.id === editingComment.id ? savedComment : comment,
            ),
          );
        } else {
          setComments(prev => [...prev, savedComment]);
        }
        
        setCommentModalVisible(false);
        setEditingComment(null);
        setCurrentAnnotationData(null);
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        Alert.alert('Error', 'Failed to save comment');
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      Alert.alert('Error', 'Failed to save comment');
    } finally {
      setSaving(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setCurrentAnnotationData({
      pageNumber: comment.pageNumber,
      rect: comment.rect,
    });
    setCommentModalVisible(true);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(
        `${API_BASE_URL}/comments/${commentId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        Alert.alert('Error', 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      Alert.alert('Error', 'Failed to delete comment');
    }
  };

  const handleNavigateToAnnotation = (comment: Comment) => {
    if (onNavigateToAnnotation) {
      onNavigateToAnnotation(comment);
    }
    navigation.goBack();
  };

  const handleAddComment = () => {
    setEditingComment(null);
    setCurrentAnnotationData(null);
    setCommentModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading comments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Comments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddComment}>
          <Icon name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <CommentsList
          comments={comments}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onNavigateToAnnotation={handleNavigateToAnnotation}
        />
      </View>

      <CommentModal
        visible={commentModalVisible}
        onClose={() => {
          setCommentModalVisible(false);
          setEditingComment(null);
          setCurrentAnnotationData(null);
        }}
        onSave={handleSaveComment}
        annotationData={currentAnnotationData}
        existingComment={editingComment?.text || ''}
        isLoading={saving}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default CommentsScreen; 