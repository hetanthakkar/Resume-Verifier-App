import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {RouteNameContext} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'http://localhost:8000/api';

interface Candidate {
  id: string;
  name: string;
  position: string;
}

interface CandidateCardProps {
  name: string;
  position: string;
  colors: string[];
  navigation: any;
  setCurrentRouteName: any;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  position,
  colors,
  navigation,
  setCurrentRouteName,
}) => (
  <TouchableOpacity
    onPress={() => {
      setCurrentRouteName('InnerHome');
      navigation.navigate('PdfView');
    }}>
    <LinearGradient
      colors={colors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.candidateCard}>
      <View style={styles.candidateInfo}>
        <Text style={styles.candidateName}>{name}</Text>
        <Text style={styles.candidatePosition}>{position}</Text>
      </View>
      <TouchableOpacity style={styles.sendEmailButton}>
        <Text style={styles.sendEmailText}>Send Email</Text>
      </TouchableOpacity>
      <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
    </LinearGradient>
  </TouchableOpacity>
);

interface ShortlistedCandidatesProps {
  navigation: any;
}
const ShortlistedCandidates: React.FC<ShortlistedCandidatesProps> = ({
  navigation,
  route,
}) => {
  const {setCurrentRouteName} = React.useContext(RouteNameContext);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const jobId = route.params?.id;
  console.log('jobId', route, navigation);

  const fetchShortlistedCandidates = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      const response = await fetch(
        `${API_BASE_URL}/jobs/${jobId}/shortlisted/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setCandidates([]);
        return;
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlistedCandidates();
  }, [jobId]);

  const gradientColors = [
    ['#FF6B6B', '#FF8E8E'],
    ['#4ECDC4', '#45B7A8'],
    ['#45AAF2', '#2D98DA'],
    ['#FF9FF3', '#F368E0'],
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        />
      </View>
      <FlatList
        data={candidates}
        renderItem={({item, index}) => (
          <CandidateCard
            setCurrentRouteName={setCurrentRouteName}
            name={item.name}
            position={item.position}
            colors={gradientColors[index % gradientColors.length]}
            navigation={navigation}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1E1E1E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#E1E1E6',
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
  listContainer: {
    paddingBottom: 24,
  },
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  candidatePosition: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  sendEmailButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  sendEmailText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShortlistedCandidates;
