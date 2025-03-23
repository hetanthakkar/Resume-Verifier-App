import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteNameContext} from '../../App';
// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api', // Android emulator localhost equivalent
});
interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uri: string;
}
interface LoadingMessageProps {
  message: string;
  isActive: boolean;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({message, isActive}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(20);
    }
  }, [isActive, opacity, translateY]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{translateY}],
        marginVertical: 8,
      }}>
      <Text style={styles.loadingText}>
        <Icon name="checkmark-circle" size={16} color="#4ECDC4" /> {message}
      </Text>
    </Animated.View>
  );
};

interface RecentScan {
  id: number;
  created_at: string;
  pdf_url: string;
  name: string;
  score: number;
}
const PdfUploadScreen: React.FC = ({route}) => {
  const {setCurrentRouteName} = React.useContext(RouteNameContext);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [spinValue] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [resumeCache, setResumeCache] = useState<{[key: number]: any}>({});

  const job = route.params.job;
  const loadingSteps = [
    'Fetching Information...',
    'Scanning GitHub projects...',
    'Fetching GitHub data...',
    'Comparing with resume...',
    'Scanning all experience info...',
    'Getting info from LinkedIn...',
    'Cross verifying data...',
    'Creating final report...',
  ];

  useEffect(() => {
    fetchRecentScans();
  }, []);

  const fetchResume = async (resumeId: number) => {
    console.log('Fetching resume:', resumeId);

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log('Data is', response);
      const data = await response.json();
      setResumeCache(prev => ({...prev, [resumeId]: data}));
      return data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      return null;
    }
  };
  const fetchRecentScans = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/job-analyses/${job.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setRecentScans(data);
    } catch (error) {
      console.error('Error fetching recent scans:', error);
    }
  };
  const renderRecentScan = ({item}: {item: RecentScan}) => (
    <TouchableOpacity
      style={styles.recentScanItem}
      onPress={async () => {
        try {
          // Fetch the resume details
          const resume = await fetchResume(item.resume_id);

          // Extract the PDF URL from the response
          const pdfUrl = resume?.pdf_file;
          console.log('job is', job, 'data is', item, pdfUrl);
          if (pdfUrl) {
            setCurrentRouteName('InnerHome');
            // Navigate to the PdfView screen with the PDF URL as a parameter
            navigation.navigate('PdfView', {
              resume_id: resume?.id,
              uri: pdfUrl, // Pass the PDF URL here
              fileName: item?.candidate_name, // Optional: Pass candidate's name
              job: job, // Pass the job information if available
              analysisData: item.analysis_data, // Additional analysis data if needed
            });
          } else {
            console.error('PDF URL is missing in the response.');
          }
        } catch (error) {
          console.error('Failed to fetch the resume:', error);
        }
      }}>
      <Icon name="document-text" size={24} color="#007AFF" />
      <View style={styles.recentScanInfo}>
        <Text style={styles.recentScanName}>{item?.candidate_name}</Text>
        <Text style={styles.recentScanDate}>
          {new Date(item.analyzed_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (isAnalyzing) {
      startSpinAnimation();
      const cleanup = progressThroughSteps();
      return () => cleanup();
    }
  }, [isAnalyzing]);

  const startSpinAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const progressThroughSteps = () => {
    let step = 0;
    const intervalId = setInterval(() => {
      if (step < loadingSteps.length - 1) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(intervalId);
      }
    }, 1500);
    return () => clearInterval(intervalId);
  };
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  console.log('route here is', route);
  const handleSingleUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (!result[0].fileCopyUri) {
        throw new Error('No file URI available');
      }
      setIsAnalyzing(true);
      setIsUploading(true);
      const token = await AsyncStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('job_id', job.id);
      formData.append('pdf_file', {
        uri:
          Platform.OS === 'ios'
            ? result[0].fileCopyUri?.replace('file://', '')
            : result[0].fileCopyUri,
        type: 'application/pdf',
        name: result[0].name || 'upload.pdf',
      });

      formData.append('job_id', route.params.id);
      console.log('formData', formData);
      const response = await fetch(
        `${API_BASE_URL}/resume-analysis/?job_id=1`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: formData,
        },
      );
      const data = await response.json();
      console.log('Data is', data);
      if (data.analysis) {
        setCurrentRouteName('InnerHome');
        navigation.navigate('PdfView', {
          resume_id: data?.resume_id,
          uri: result[0].fileCopyUri,
          fileName: result[0].name,
          job: job,
          analysisData: data.analysis,
        });
      } else {
        throw new Error('Missing analysis data in response');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the upload');
      } else {
        console.error('Error:', err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf],
      });

      setIsUploading(true);
      // Bulk upload logic here
      setUploadedFiles(prev => [...prev, ...results]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the upload');
      } else {
        console.error('Error:', err);
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (isAnalyzing && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingMessages}>
            {loadingSteps.map((step, index) => (
              <LoadingMessage
                key={index}
                message={step}
                isActive={index <= currentStep}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.uploadCard}
          onPress={handleSingleUpload}
          disabled={isUploading}>
          <LinearGradient
            colors={['#45AAF2', '#2D98DA']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientCard}>
            {!isUploading && (
              <>
                <Icon name="cloud-upload-outline" size={50} color="#FFF" />
                <Text style={styles.uploadText}>Upload PDF</Text>
                <Text style={styles.uploadSubtext}>Tap to select a file</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[
            styles.bulkUploadButton,
            isUploading && styles.disabledButton,
          ]}
          onPress={handleBulkUpload}
          disabled={isUploading}>
          <Icon name="documents-outline" size={24} color="#007AFF" />
          <Text style={styles.bulkUploadText}>Bulk Upload PDFs</Text>
        </TouchableOpacity> */}

        {uploadedFiles.length > 0 && (
          <View style={styles.uploadedFiles}>
            <Text style={styles.uploadedTitle}>
              Uploaded Files ({uploadedFiles.length})
            </Text>
            {uploadedFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Icon name="document-text-outline" size={24} color="#007AFF" />
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
              </View>
            ))}
          </View>
        )}
        {!isAnalyzing && recentScans.length > 0 && (
          <View style={styles.recentScansContainer}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <FlatList
              data={recentScans}
              renderItem={renderRecentScan}
              keyExtractor={item => item.id.toString()}
              style={styles.recentScansList}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCard: {
    width: '100%',
    maxWidth: 300,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  bulkUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 16,
  },
  bulkUploadText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  uploadedFiles: {
    width: '100%',
    marginTop: 24,
  },
  uploadedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  fileName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1E1E1E',
  },

  gradientCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingMessages: {
    marginTop: 40,
    alignItems: 'flex-start',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  recentScansContainer: {
    width: '100%',
    marginTop: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  recentScansList: {
    flex: 1,
  },
  recentScanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  recentScanInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentScanName: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '500',
  },
  recentScanDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default PdfUploadScreen;
