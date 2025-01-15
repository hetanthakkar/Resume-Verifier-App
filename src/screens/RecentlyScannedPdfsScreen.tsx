import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteNameContext} from '../../App';

const API_BASE_URL = 'http://localhost:8000/api';

const ResumeListScreen = ({navigation, route}) => {
  const {setCurrentRouteName} = React.useContext(RouteNameContext);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobCache, setJobCache] = useState({});
  const job = route.params?.job;

  const gradientColors = [
    ['#FF6B6B', '#FF8E8E'],
    ['#4ECDC4', '#45B7A8'],
    ['#45AAF2', '#2D98DA'],
    ['#FF9FF3', '#F368E0'],
  ];

  useEffect(() => {
    fetchRecentScans();
  }, []);

  const fetchRecentScans = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/recent-analyses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRecentScans(data);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchJob = async jobId => {
    try {
      // Check cache first
      if (jobCache[jobId]) {
        return jobCache[jobId];
      }

      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jobData = await response.json();

      // Update cache
      setJobCache(prev => ({...prev, [jobId]: jobData}));
      return jobData;
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  };
  const fetchResume = async (resumeId: number) => {
    console.log('Fetching resume:', resumeId);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log('Data is', response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      return null;
    }
  };

  const handleItemPress = async item => {
    try {
      setCurrentRouteName('InnerHome');
      const jobData = await fetchJob(item.job_id);
      const resume = await fetchResume(item.resume_id);
      console.log('resume is', resume);
      if (jobData && resume) {
        navigation.navigate('PdfView', {
          uri: resume?.pdf_file,
          fileName: item.candidate_name,
          job: jobData,
          analysisData: item.analysis_data,
          resume_id: resume?.id,
        });
      } else {
        console.error('Failed to fetch job data');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error handling item press:', error);
    }
  };
  // Move the hooks to a separate functional component
  const ResumeItem = ({item, index, job, navigation}) => {
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={styles.itemContainer}>
        <LinearGradient
          colors={gradientColors[index % gradientColors.length]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.item}>
          <View style={styles.iconContainer}>
            <Feather name="file-text" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.candidate_name}</Text>
            <Text style={styles.jobTitle}>
              {item?.job_title || 'Not specified'}
            </Text>
            <Text style={styles.date}>
              {new Date(item.analyzed_at).toLocaleDateString()}
            </Text>
          </View>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const filteredScans = recentScans.filter(scan =>
    scan.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const renderItem = ({item, index}) => {
    return (
      <ResumeItem item={item} index={index} job={job} navigation={navigation} />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recently Scanned Resumes</Text>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search candidates..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredScans}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matches found' : 'No recent scans available'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 24,
  },
  itemContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ResumeListScreen;
