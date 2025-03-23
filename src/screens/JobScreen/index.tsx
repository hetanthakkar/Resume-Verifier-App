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
import {mentalHealthMatches} from '../../static_data/data';

import {apiCall, API_BASE_URL} from './utils/api';

const PotentialMatches = ({navigation}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMatches = async () => {
    try {
      // In a real app, we would fetch matches from an API
      // For now, we'll use our static data
      setMatches(mentalHealthMatches);

      // Simulate API loading
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      Alert.alert('Error', 'Failed to load potential matches');
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
                // setCurrentRouteName('InnerHome');
                navigation.navigate('ChatScreen', {
                  chatId: item.id,
                  userName: item.userName,
                  // challenge: chat.challenge,
                });
                // navigation.navigate('JobTab', {
                //   id: item.id,
                //   mode: 'view',
                //   job: item,
                // });
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
