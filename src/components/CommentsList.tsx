import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

interface CommentsListProps {
  comments: Comment[];
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (commentId: string) => void;
  onNavigateToAnnotation: (comment: Comment) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  onEditComment,
  onDeleteComment,
  onNavigateToAnnotation,
}) => {
  const handleDelete = (comment: Comment) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteComment(comment.id),
        },
      ],
    );
  };

  const renderComment = ({item}: {item: Comment}) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.commentInfo}>
          <Text style={styles.pageNumber}>Page {item.pageNumber}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onNavigateToAnnotation(item)}>
            <Icon name="location-on" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEditComment(item)}>
            <Icon name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}>
            <Icon name="delete" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.commentText}>{item.text}</Text>
      
      {item.rect && item.rect.x1 !== undefined && (
        <View style={styles.positionInfo}>
          <Text style={styles.positionText}>
            Position: ({item.rect.x1.toFixed(1)}, {item.rect.y1.toFixed(1)}) - ({item.rect.x2.toFixed(1)}, {item.rect.y2.toFixed(1)})
          </Text>
        </View>
      )}
    </View>
  );

  if (comments.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="comment" size={48} color="#CCC" />
        <Text style={styles.emptyText}>No comments yet</Text>
        <Text style={styles.emptySubtext}>
          Add comments by highlighting text in the PDF
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentInfo: {
    flex: 1,
  },
  pageNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 16,
    color: '#1E1E1E',
    lineHeight: 22,
    marginBottom: 8,
  },
  positionInfo: {
    backgroundColor: '#F0F8FF',
    padding: 8,
    borderRadius: 4,
  },
  positionText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default CommentsList; 