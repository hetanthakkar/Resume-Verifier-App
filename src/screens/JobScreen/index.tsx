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
import JobCard from './JobCard';
import EmptyState from './EmptyState';
import {GRADIENT_COLORS, apiCall, API_BASE_URL} from './utils';
import { useTheme } from '../../theme/ThemeContext';

interface Job {
  id: number;
  title: string;
  company_name: string;
}

const JobPortals = ({navigation}) => {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          padding: 16,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: theme.colors.text,
            }}>
            Your Job Postings
          </Text>
          <TouchableOpacity
            style={{
              padding: 8,
            }}
            onPress={fetchJobs}>
            <Text
              style={{
                fontSize: 24,
                color: theme.colors.primary,
              }}>
              ↻
            </Text>
          </TouchableOpacity>
        </View>
        {jobs?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
            }}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                },
                {
                  backgroundColor: theme.colors.success,
                },
              ]}
              onPress={handleJoinGroup}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                Join Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                },
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => navigation.navigate('CreateJob')}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                Create Job
              </Text>
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
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
          }}
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
        <View
          style={{
            backgroundColor: theme.colors.surface,
            padding: 20,
            borderRadius: 12,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
              color: theme.colors.text,
            }}>
            Enter Group Code
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              marginBottom: 16,
              backgroundColor: theme.colors.input,
              color: theme.colors.text,
            }}
            value={groupCode}
            onChangeText={setGroupCode}
            placeholder="Enter code"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="number-pad"
            autoFocus
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 12,
            }}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                },
                {
                  backgroundColor: theme.colors.border,
                },
              ]}
              onPress={() => setCodeModalVisible(false)}>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontWeight: '600',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                },
                {
                  backgroundColor: theme.colors.success,
                },
              ]}
              onPress={submitGroupCode}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                }}>
                Join
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default JobPortals;
