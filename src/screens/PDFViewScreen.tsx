import React, {useState, useContext, useCallback, useEffect, useRef} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {DocumentView, Config} from '@pdftron/react-native-pdf';
import {NavigationContext, useNavigation} from '@react-navigation/native';
import {RouteNameContext} from '../../App';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentModal from '../components/CommentModal';

const API_BASE_URL = 'http://localhost:8000/api';

interface AnnotationData {
  pageNumber: number;
  rect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  type: string;
  contents: string;
  id: string;
}

interface Comment {
  id: number;
  text: string;
  page_number: number;
  rect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  annotation_id: string;
  created_at: string;
  user?: {
    name: string;
  };
}

const PdfViewScreen = ({route}) => {
  const routeNameContext = React.useContext(RouteNameContext);
  const navigation = useNavigation();
  const {uri, job, resume_id} = route.params;
  
  // Debug logging for route parameters
  console.log('PDFViewScreen route params:', route.params);
  console.log('Resume ID:', resume_id);
  // console.log('Job:', job);
  
  // Component state
  const [isFavorite, setIsFavorite] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentAnnotationData, setCurrentAnnotationData] = useState<AnnotationData | null>(null);
  const [savingComment, setSavingComment] = useState(false);
  const [existingComments, setExistingComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const documentViewRef = useRef<any>(null);

  // Check if the current resume is shortlisted for this job
  const checkIfShortlisted = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/check_shortlisted/${job.id}/${resume_id}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Shortlist check response:', data);
        setIsFavorite(data.shortlisted || false);
      } else {
        console.error('Failed to check shortlist status:', response.status);
      }
    } catch (error) {
      console.error('Error checking shortlist status:', error);
    }
  };

  // Load existing comments from backend
  const loadExistingComments = async () => {
    try {
      setIsLoadingComments(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/comments/?resume_id=${resume_id}&job_id=${job.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const comments = await response.json();
        console.log('Loaded existing comments:', comments);
        setExistingComments(comments);
        
        // Add visual markers for existing comments
        await addCommentMarkers(comments);
      } else {
        console.error('Failed to load comments:', response.status);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Add visual markers for existing comments
  const addCommentMarkers = async (comments: Comment[]) => {
    if (!documentViewRef.current || comments.length === 0) return;

    try {
      // Group comments by area (similar coordinates)
      const commentGroups = groupCommentsByArea(comments);
      
      for (const group of commentGroups) {
        const firstComment = group[0];
        const commentCount = group.length;
        
        // Create a visual marker annotation for this comment area
        await createCommentMarker(firstComment, commentCount);
      }
    } catch (error) {
      console.error('Error adding comment markers:', error);
    }
  };

  // Group comments that are close to each other (within 20 pixels)
  const groupCommentsByArea = (comments: Comment[]) => {
    const groups: Comment[][] = [];
    const tolerance = 20; // pixels
    
    for (const comment of comments) {
      let addedToGroup = false;
      
      for (const group of groups) {
        const firstInGroup = group[0];
        
        // Check if comment is close to this group
        if (
          comment.page_number === firstInGroup.page_number &&
          Math.abs(comment.rect.x1 - firstInGroup.rect.x1) < tolerance &&
          Math.abs(comment.rect.y1 - firstInGroup.rect.y1) < tolerance
        ) {
          group.push(comment);
          addedToGroup = true;
          break;
        }
      }
      
      if (!addedToGroup) {
        groups.push([comment]);
      }
    }
    
    return groups;
  };

  // Check if two comments are nearby (within tolerance)
  const areCommentsNearby = (comment1: Comment, comment2: Comment) => {
    const tolerance = 20;
    return comment1.page_number === comment2.page_number &&
           Math.abs(comment1.rect.x1 - comment2.rect.x1) < tolerance &&
           Math.abs(comment1.rect.y1 - comment2.rect.y1) < tolerance;
  };

  // Create a visual marker for comment area
  const createCommentMarker = async (comment: Comment, count: number) => {
    try {
      // Create XFDF for a sticky note marker that shows comments when clicked
      const markerXfdf = `<?xml version="1.0" encoding="UTF-8"?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
  <add>
    <text 
      page="${comment.page_number - 1}" 
      rect="${comment.rect.x1},${comment.rect.y1},${comment.rect.x2},${comment.rect.y2}"
      color="#FF6B35" 
      opacity="0.8"
      flags="print"
      name="comment_marker_${comment.id}"
      title="💬 ${count} comment${count > 1 ? 's' : ''}"
      contents="Click to view ${count} comment${count > 1 ? 's' : ''}"
      icon="Comment"
      state="Unmarked"
      creationdate="D:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}Z">
    </text>
  </add>
</xfdf>`;

      await documentViewRef.current?.importAnnotations(markerXfdf);
      console.log(`Created marker for ${count} comments at:`, comment.rect);
    } catch (error) {
      console.error('Error creating comment marker:', error);
    }
  };

  // Initialize when component mounts and document loads
  useEffect(() => {
    if (job?.id && resume_id) {
      checkIfShortlisted();
    }
  }, [job?.id, resume_id]);

  // Load comments when document is ready
  const handleDocumentLoaded = useCallback(() => {
    console.log('Document loaded, loading existing comments...');
    loadExistingComments();
  }, [resume_id, job?.id]);

  // Handle navigation back to main job screen
  const onLeadingNavButtonPressed = useCallback(() => {
    if (routeNameContext) {
      routeNameContext.setCurrentRouteName('other');
    }
    
    // Try parent navigation first, fallback to direct navigation
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('MainJob' as never);
    } else {
      navigation.navigate('MainJob' as never);
    }
  }, [routeNameContext, navigation]);

  // Handle shortlist/unshortlist toggle
  const handleFavoritePress = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const endpoint = isFavorite 
        ? `${API_BASE_URL}/jobs/${job.id}/unshortlist/${resume_id}/`
        : `${API_BASE_URL}/jobs/${job.id}/shortlist/${resume_id}/`;
      
      const method = isFavorite ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        console.log(`Successfully ${isFavorite ? 'removed from' : 'added to'} shortlist`);
      } else {
        console.error('Failed to update favorite status:', response.status);
        Alert.alert('Error', 'Failed to update shortlist status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      Alert.alert('Error', 'Network error occurred');
    }
  }, [job?.id, resume_id, isFavorite]);

  // Extract coordinates from XFDF string
  const parseXFDFCoordinates = useCallback((xfdfCommand: string, annotationId: string) => {
    try {
      // Look for the annotation with matching ID in XFDF
      const rectMatch = xfdfCommand.match(new RegExp(`name="${annotationId}"[^>]*rect="([^"]*)"`, 'i'));
      if (rectMatch && rectMatch[1]) {
        const coordinates = rectMatch[1].split(',').map(Number);
        if (coordinates.length === 4) {
          return {
            x1: coordinates[0],
            y1: coordinates[1],
            x2: coordinates[2],
            y2: coordinates[3],
          };
        }
      }

      // Fallback: look for any rect in the XFDF (for cases where name matching fails)
      const generalRectMatch = xfdfCommand.match(/rect="([^"]*)"/, 'i');
      if (generalRectMatch && generalRectMatch[1]) {
        const coordinates = generalRectMatch[1].split(',').map(Number);
        if (coordinates.length === 4) {
          return {
            x1: coordinates[0],
            y1: coordinates[1],
            x2: coordinates[2],
            y2: coordinates[3],
          };
        }
      }
    } catch (error) {
      console.error('Error parsing XFDF coordinates:', error);
    }
    
    return null;
  }, []);

  // Handle annotation export command - this contains the coordinate data!
  const handleExportAnnotationCommand = useCallback(({action, xfdfCommand, annotations}) => {
    console.log('=== EXPORT ANNOTATION COMMAND DEBUG ===');
    console.log('Action:', action);
    console.log('XFDF Command:', xfdfCommand);
    console.log('Annotations:', annotations);
    console.log('=== END EXPORT DEBUG ===');

    // Only handle 'add' actions for new annotations
    if (action === 'add' && annotations && annotations.length > 0) {
      const firstAnnotation = annotations[0];
      
      // Skip if this is a comment marker we created
      if (firstAnnotation.id?.startsWith('comment_marker_')) {
        return;
      }
      
      // Extract coordinates from XFDF
      const coordinates = parseXFDFCoordinates(xfdfCommand, firstAnnotation.id);
      
      if (coordinates) {
        const annotationData = {
          pageNumber: firstAnnotation.pageNumber || 1,
          rect: coordinates,
          type: firstAnnotation.type || 'Unknown',
          contents: '',
          id: firstAnnotation.id || Date.now().toString(),
        };

        console.log('Processed annotation with coordinates from XFDF:', annotationData);
        setCurrentAnnotationData(annotationData);
        setCommentModalVisible(true);
      } else {
        console.warn('Could not extract coordinates from XFDF for annotation:', firstAnnotation.id);
        
        // Fallback: show modal without coordinates
        const annotationData = {
          pageNumber: firstAnnotation.pageNumber || 1,
          rect: { x1: 0, y1: 0, x2: 0, y2: 0 },
          type: firstAnnotation.type || 'Unknown',
          contents: '',
          id: firstAnnotation.id || Date.now().toString(),
        };

        setCurrentAnnotationData(annotationData);
        setCommentModalVisible(true);
      }
    }
  }, [parseXFDFCoordinates]);

  // Handle clicks on existing comment markers - FIXED TO VIEW COMMENTS
  const handleAnnotationMenuPress = useCallback(({annotationMenu, annotations}) => {
    console.log('Annotation menu pressed:', annotationMenu);
    console.log('Selected annotations:', annotations);
    
    if (annotations && annotations.length > 0) {
      const firstAnnotation = annotations[0];
      
      // Check if this is a comment marker - show existing comments instead of opening modal to add new comment
      if (firstAnnotation.id?.startsWith('comment_marker_')) {
        console.log('Comment marker clicked, showing existing comments');
        
        // Extract the original comment data to get coordinates
        const commentId = firstAnnotation.id.replace('comment_marker_', '');
        const originalComment = existingComments.find(c => c.id === parseInt(commentId));
        
        if (originalComment) {
          // Find all comments in the same area
          const relatedComments = existingComments.filter(comment => 
            areCommentsNearby(comment, originalComment)
          );
          
          console.log('Found related comments:', relatedComments);
          
          // Navigate to comments view to show existing comments
          navigation.navigate('Comments', {
            resumeId: resume_id,
            jobId: job.id,
            filterComments: relatedComments,
            onNavigateToAnnotation: handleNavigateToAnnotation,
            highlightArea: originalComment.rect, // Optional: highlight the comment area
          });
        }
        return;
      }

      // Handle regular annotations - allow adding new comments
      const rectSource = firstAnnotation.pageRect || firstAnnotation.screenRect || firstAnnotation.rect;
      
      const annotationData = {
        pageNumber: firstAnnotation.pageNumber || 1,
        rect: rectSource ? {
          x1: rectSource.x1 || 0,
          y1: rectSource.y1 || 0,
          x2: rectSource.x2 || 0,
          y2: rectSource.y2 || 0,
        } : { x1: 0, y1: 0, x2: 0, y2: 0 },
        type: firstAnnotation.type || 'Unknown',
        contents: '',
        id: firstAnnotation.id || Date.now().toString(),
      };
      
      console.log('Opening comment modal for existing annotation:', annotationData);
      setCurrentAnnotationData(annotationData);
      setCommentModalVisible(true);
    }
  }, [existingComments, navigation, resume_id, job?.id, handleNavigateToAnnotation, areCommentsNearby]);

  // Show existing comments for a specific area
  const showExistingComments = useCallback((commentId: number) => {
    const relatedComments = existingComments.filter(comment => 
      comment.id === commentId || 
      (existingComments.find(c => c.id === commentId) && areCommentsNearby(comment, existingComments.find(c => c.id === commentId)!))
    );
    
    // Navigate to comments list screen
    navigation.navigate('Comments', {
      resumeId: resume_id,
      jobId: job.id,
      filterComments: relatedComments,
      onNavigateToAnnotation: handleNavigateToAnnotation,
    });
  }, [existingComments, navigation, resume_id, job?.id, handleNavigateToAnnotation, areCommentsNearby]);

  // Save comment with annotation coordinates to backend
  const handleSaveComment = useCallback(async (commentText, annotationData) => {
    if (!commentText?.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    if (!annotationData) {
      Alert.alert('Error', 'Annotation data is missing');
      return;
    }

    try {
      setSavingComment(true);
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Prepare comment data with coordinates
      const commentData = {
        text: commentText.trim(),
        page_number: annotationData.pageNumber,
        rect: {
          x1: annotationData.rect.x1,
          y1: annotationData.rect.y1,
          x2: annotationData.rect.x2,
          y2: annotationData.rect.y2,
        },
        resume_id: resume_id,
        job_id: job.id,
        annotation_type: annotationData.type,
        annotation_id: annotationData.id,
      };

      console.log('Sending comment to backend:', commentData);
      
      // Validate coordinates before sending
      const hasValidCoords = !(commentData.rect.x1 === 0 && commentData.rect.y1 === 0 && 
                              commentData.rect.x2 === 0 && commentData.rect.y2 === 0);

      if (!hasValidCoords) {
        const proceed = await new Promise((resolve) => {
          Alert.alert(
            'Missing Coordinates', 
            'No coordinate information was found for this annotation. The comment will be saved but may not have proper positioning. Continue?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Save Anyway', onPress: () => resolve(true) }
            ]
          );
        });
        
        if (!proceed) return;
      }
      
      await sendCommentToBackend();

      async function sendCommentToBackend() {
        const response = await fetch(`${API_BASE_URL}/comments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(commentData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Comment saved successfully:', responseData);
          Alert.alert('Success', 'Comment saved successfully');
          setCommentModalVisible(false);
          setCurrentAnnotationData(null);
          
          // Reload comments to update markers
          await loadExistingComments();
        } else {
          const errorData = await response.json();
          console.error('Server error saving comment:', errorData);
          Alert.alert('Error', errorData.message || 'Failed to save comment');
        }
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      Alert.alert('Error', 'Network error occurred while saving comment');
    } finally {
      setSavingComment(false);
    }
  }, [resume_id, job?.id, loadExistingComments]);

  // Navigate to annotation position in PDF
  const handleNavigateToAnnotation = useCallback((comment) => {
    if (documentViewRef.current && comment.rect && comment.page_number) {
      try {
        // Set the current page first
        documentViewRef.current.setCurrentPage(comment.page_number);
        
        // Optionally zoom to the annotation area
        // documentViewRef.current.zoomToRect(comment.page_number, comment.rect);
        
        console.log('Navigated to annotation on page:', comment.page_number);
      } catch (error) {
        console.error('Error navigating to annotation:', error);
      }
    } else {
      console.warn('Cannot navigate to annotation: missing data or ref');
    }
  }, []);

  // Navigate to comments list screen
  const handleCommentsPress = useCallback(() => {
    console.log('Opening comments list');
    navigation.navigate('Comments', {
      resumeId: resume_id,
      jobId: job.id,
      onNavigateToAnnotation: handleNavigateToAnnotation,
    });
  }, [resume_id, job?.id, navigation, handleNavigateToAnnotation]);

  return (
    <View style={styles.container}>
      <DocumentView
        ref={documentViewRef}
        style={styles.pdfView}
        document={Platform.OS === 'ios' ? uri.replace('file://', '') : uri}
        
        // Navigation configuration
        showLeadingNavButton={true}
        leadingNavButtonIcon={
          Platform.OS === 'ios'
            ? 'ic_close_black_24px.png'
            : 'ic_arrow_back_white_24dp'
        }
        onLeadingNavButtonPressed={onLeadingNavButtonPressed}
        onDocumentLoaded={handleDocumentLoaded}
        
        // Top toolbar configuration
        topAppNavBarRightBar={[
          Config.Buttons.searchButton,
          Config.Buttons.shareButton,
        ]}
        
        // Hide unnecessary default toolbars but keep highlighting tools
        hideDefaultAnnotationToolbars={[
          Config.DefaultToolbars.Favorite,
          Config.DefaultToolbars.FillAndSign,
          Config.DefaultToolbars.Redaction,
          Config.DefaultToolbars.Measure,
          Config.DefaultToolbars.PrepareForm,
          Config.DefaultToolbars.View,
          Config.DefaultToolbars.Pens,
          Config.DefaultToolbars.Insert,
          Config.DefaultToolbars.Draw,
        ]}
        
        // Enable text selection improvements
        pageChangeOnTap={false}
        selectAnnotationAfterCreation={true}
        continuousAnnotationEditing={false}
        
        // Override annotation menu behavior to show comment modal for all annotation types
        overrideAnnotationMenuBehavior={[
          Config.AnnotationMenu.note,
          Config.AnnotationMenu.text,
          Config.AnnotationMenu.freeText,
        ]}
        
        // Annotation event handlers
        onExportAnnotationCommand={handleExportAnnotationCommand}
        onAnnotationMenuPress={handleAnnotationMenuPress}
        onLongPressMenuPress={handleAnnotationMenuPress}
      />
      
      {/* Floating action buttons */}
      <TouchableOpacity
        style={[styles.favoriteButton, { backgroundColor: isFavorite ? '#FF6B6B' : 'white' }]}
        onPress={handleFavoritePress}
        accessibilityLabel={isFavorite ? "Remove from shortlist" : "Add to shortlist"}
      >
        <Icon
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorite ? 'white' : '#FF6B6B'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.commentsButton, { backgroundColor: existingComments.length > 0 ? '#4ECDC4' : 'white' }]}
        onPress={handleCommentsPress}
        accessibilityLabel={`View all comments (${existingComments.length})`}
      >
        <Icon 
          name="chat-bubble" 
          size={24} 
          color={existingComments.length > 0 ? 'white' : '#4ECDC4'} 
        />
        {existingComments.length > 0 && (
          <View style={styles.commentBadge}>
            <Icon name="circle" size={8} color="#FF6B35" />
          </View>
        )}
      </TouchableOpacity>

      {/* Comment modal for annotation input */}
      <CommentModal
        visible={commentModalVisible}
        onClose={() => {
          setCommentModalVisible(false);
          setCurrentAnnotationData(null);
        }}
        onSave={handleSaveComment}
        annotationData={currentAnnotationData}
        isLoading={savingComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  pdfView: {
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 10 : 20,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  commentsButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 75 : 85,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  commentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PdfViewScreen;