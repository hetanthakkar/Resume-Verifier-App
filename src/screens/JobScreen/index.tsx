import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './styles';
import JobCard from './components/JobCard/index';
import EmptyState from './components/EmptyState';
import {GRADIENT_COLORS} from './constants/theme';
import {matchAPI} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Match {
  id: number;
  name: string;
  challenge: string;
  age: string;
  similarity: number;
  lastActive: string;
}

interface APIResponse {
  id: number;
  matched_user: {
    username: string;
    problem?: {
      description: string;
    };
    date_of_birth?: string;
  };
  similarity_score: number;
  last_interaction: string;
}

const PotentialMatches = ({navigation}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      // Get the access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem('access_token');
      if (!accessToken) {
        Alert.alert('Error', 'Please login again');
        navigation.navigate('Login');
        return;
      }

      const response: APIResponse[] = await matchAPI.getMatches();
      
      // Transform the API response to match our UI format
      const transformedMatches: Match[] = response.map(match => ({
        id: match.id,
        name: match.matched_user.username || `Anonymous User ${match.id}`,
        challenge: match.matched_user.problem?.description || 'No description available',
        age: match.matched_user.date_of_birth ? 
          `${new Date().getFullYear() - new Date(match.matched_user.date_of_birth).getFullYear()}` : 
          'Not specified',
        similarity: Math.round(match.similarity_score * 100),
        lastActive: new Date(match.last_interaction).toLocaleDateString(),
      }));
      
      setMatches(transformedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Failed to load potential matches');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter matches based on search query
  const filteredMatches = matches.filter(match => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    // Search in name
    if (match.name?.toLowerCase().includes(query)) return true;

    // Search in challenge description
    if (match.challenge?.toLowerCase().includes(query)) return true;

    // Search in age range
    if (match.age?.toLowerCase().includes(query)) return true;

    return false;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMatches();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Potential Matches</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchMatches}>
            <Text style={styles.refreshButtonText}>↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, age or challenge..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {matches.length ? (
        <FlatList
          data={filteredMatches}
          renderItem={({item, index}) => (
            <JobCard
              job={{
                id: item.id,
                title: item.name,
                company_name: item.challenge,
                similarity: item.similarity,
                lastActive: item.lastActive,
                age: item.age,
              }}
              gradientColors={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
              onPress={() => {
                navigation.navigate('ChatScreen', {
                  chatId: item.id,
                  userName: item.name,
                  challenge: item.challenge,
                });
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchMatches}
          ListEmptyComponent={
            searchQuery.trim() ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  No matches found for "{searchQuery}"
                </Text>
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchButtonText}>Clear Search</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <EmptyState
                onCreatePress={() => navigation.navigate('CreateJob')}
                onJoinPress={() => {}}
              />
            )
          }
        />
      ) : (
        <EmptyState
          onCreatePress={() => navigation.navigate('CreateJob')}
          onJoinPress={() => {}}
        />
      )}
    </SafeAreaView>
  );
};

export default PotentialMatches;
