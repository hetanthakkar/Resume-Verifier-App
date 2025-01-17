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
import Modal from 'react-native-modal';
import {styles} from './styles';
import JobCard from './components/JobCard/index';
import EmptyState from './components/EmptyState';
import {GRADIENT_COLORS} from './constants/theme';

import {apiCall, API_BASE_URL} from './utils/api';

const JobPortals = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCodeModalVisible, setCodeModalVisible] = useState(false);
  const [groupCode, setGroupCode] = useState('');

  const handleJoinGroup = () => {
    setCodeModalVisible(true);
  };

  const fetchJobs = async () => {
    try {
      const response = await apiCall(`${API_BASE_URL}/api/jobs/`);
      if (response.ok) {
        const data = await response.json();
        console.log('response is', data);
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
      const response = await apiCall(
        `${API_BASE_URL}/api/jobs/${groupCode}/join/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
              gradientColors={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
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
        <EmptyState
          onCreatePress={() => navigation.navigate('CreateJob')}
          onJoinPress={handleJoinGroup}
        />
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

export default JobPortals;
