import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Alert,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
const API_URL = Platform.select({
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000', // Android emulator localhost equivalent
});
import Modal from 'react-native-modal';
import {
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from './JobScreen/utils/api';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 220;

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  employment_type: string;
  created_at: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  years_of_experience: number;
  education: string;
}
const gradientColors = [
  ['#FF6B6B', '#FF8E8E'], // Red
  ['#4ECDC4', '#45B7A8'], // Teal
  ['#45AAF2', '#2D98DA'], // Blue
  ['#FF9FF3', '#F368E0'], // Pink
];
const JobCard: React.FC<JobCardProps> = ({
  job,
  gradientColors,
  onPress,
  onJoin,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getDate = time => {
    // Convert to Date object
    const date = new Date(time);

    // Format the date to a meaningful format
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'short', // Full name of the day (e.g., Monday)
      year: 'numeric',
      month: 'short', // Full name of the month (e.g., January)
      day: 'numeric',
    });
    return formattedDate;
  };
  const copyJobId = () => {
    Clipboard.setString(toString(job.id));
    Alert.alert('Success', 'Job ID copied to clipboard');
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.jobCard,
          {
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.98],
                }),
              },
            ],
          },
        ]}>
        <Svg height={CARD_HEIGHT} width={CARD_WIDTH}>
          <Defs>
            <LinearGradient
              id={`grad-${job.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">
              <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
              <Stop
                offset="100%"
                stopColor={gradientColors[1]}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#grad-${job.id})`}
            rx="12"
            ry="12"
          />

          {/* Title text split into multiple lines if needed */}
          {job.title
            .split(' ')
            .reduce(
              (acc: JSX.Element[], word: string, i: number, arr: string[]) => {
                const lineLength = 20;
                const currentLine = Math.floor(i / 4);
                const y = CARD_HEIGHT / 2 - 20 + currentLine * 35;

                if (i % 4 === 0) {
                  const lineText = arr.slice(i, i + 4).join(' ');
                  acc.push(
                    <SvgText
                      key={i}
                      fill="white"
                      fontSize="28"
                      fontWeight="bold"
                      x={CARD_WIDTH / 2}
                      y={y}
                      textAnchor="middle">
                      {truncateText(lineText, lineLength)}
                    </SvgText>,
                  );
                }
                return acc;
              },
              [],
            )}
        </Svg>

        <View style={styles.jobDetails}>
          <Text style={styles.jobInfo} numberOfLines={1} ellipsizeMode="tail">
            {truncateText(job.company_name, 30)}
          </Text>
          <TouchableOpacity onPress={copyJobId} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>Copy Job ID</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refresh: refreshToken}),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem('accessToken', data.access);
      return data.access;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const apiCall = async (url: string, options = {}) => {
  const token = await AsyncStorage.getItem('accessToken');
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }
  return response;
};

const JobPortals: React.FC = ({navigation}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCodeModalVisible, setCodeModalVisible] = useState(false);
  const [groupCode, setGroupCode] = useState('');

  const handleJoinGroup = async () => {
    setCodeModalVisible(true);
  };

  const fetchJobs = async () => {
    console.log('came here');
    try {
      const response = await apiCall(`${API_URL}/api/jobs/`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else if (response.status === 401) {
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };
  const submitGroupCode = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await apiCall(
        `http://localhost:8000/api/jobs/${groupCode}/join/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({code: groupCode}),
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Successfully joined the group');
        fetchJobs();
      } else {
        Alert.alert('Error', 'Invalid code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join group');
    } finally {
      setCodeModalVisible(false);
      setGroupCode('');
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchJobs();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Jobs Available</Text>
      <Text style={styles.emptySubtitle}>
        Create a new job or join a group to get started
      </Text>
      <View style={styles.emptyButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.createButton]}
          onPress={() => navigation.navigate('CreateJob')}>
          <Text style={styles.actionButtonText}>Create Job</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.joinButton]}
          onPress={handleJoinGroup}>
          <Text style={styles.actionButtonText}>Join Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Your Job Postings</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchJobs}>
            <Text style={styles.refreshButtonText}>↻</Text>
          </TouchableOpacity>
        </View>
        {jobs?.length > 0 && (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.joinButton]}
              onPress={handleJoinGroup}>
              <Text style={styles.actionButtonText}>Join Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.createButton]}
              onPress={() => navigation.navigate('CreateJob')}>
              <Text style={styles.actionButtonText}>Create Job</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {jobs.length ? (
        <FlatList
          data={jobs}
          renderItem={({item, index}) => (
            <JobCard
              job={item}
              gradientColors={gradientColors[index % gradientColors.length]}
              onPress={() => {
                navigation.navigate('JobTab', {
                  id: item.id,
                  mode: 'view',
                  job: item,
                });
              }}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchJobs}
        />
      ) : (
        <EmptyState />
      )}
      <Modal
        isVisible={isCodeModalVisible}
        onBackdropPress={() => setCodeModalVisible(false)}
        avoidKeyboard>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter Group Code</Text>
          <TextInput
            style={styles.codeInput}
            value={groupCode}
            onChangeText={setGroupCode}
            placeholder="Enter code"
            keyboardType="number-pad"
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setCodeModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={submitGroupCode}>
              <Text style={styles.submitButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  jobPostingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  jobPostingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    // opacity: 0.8
  },
  createJobButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.8,
  },
  createJobButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  jobId: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  postedDate: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  jobInfo: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.8,
  },
  joinButton: {
    backgroundColor: '#28A745',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    // borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#28A745',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
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
  submitButton: {
    backgroundColor: '#28A745',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobId: {
    color: '#fff',
    fontSize: 14,
  },
  copyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
});

export default JobPortals;
