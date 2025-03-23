import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import EditModal from './EditModal';
interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  rightIcon?: string;
  colors: string[];
  onPress?: () => void;
}
interface ProfileData {
  name: string;
  email: string;
  company: string;
  problem?: {
    description: string;
    created_at: string;
    updated_at: string;
  };
}

const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api', // Android emulator localhost equivalent
});
interface UserProfile {
  name: string;
  email: string;
  company: string;
  problem?: {
    description: string;
    created_at: string;
    updated_at: string;
  };
  lastUpdated?: number;
}

// Constants
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  AUTH_TOKEN: 'auth_token',
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  value: string;
  title: string;
  field: 'name' | 'company' | 'email' | 'problem';
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  value,
  rightIcon,
  colors,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={colors}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.row}>
      <Ionicons name={icon} size={24} color="#FFFFFF" />
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      <Ionicons
        name={rightIcon || 'chevron-forward'}
        size={24}
        color="#FFFFFF"
      />
    </LinearGradient>
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    company: '',
    problem: {
      description: '',
      created_at: '',
      updated_at: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  // Fetch profile from API
  const fetchProfileFromAPI = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      const profileWithTimestamp = {
        ...data,
        lastUpdated: Date.now(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(profileWithTimestamp),
      );

      setProfile(profileWithTimestamp);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  };

  const loadProfileFromStorage = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem(
        STORAGE_KEYS.USER_PROFILE,
      );
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (err) {
      console.error('Error loading profile from storage:', err);
    }
  };
  const updateProfile = async (
    field: keyof UserProfile,
    value: string,
  ): Promise<boolean> => {
    console.log('field', field);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/profile/update/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({[field]: value}),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = {
        ...profile,
        [field]: value,
        lastUpdated: Date.now(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(updatedProfile),
      );

      setProfile(updatedProfile);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  const fetchProblem = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/problem/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch problem');

      const data = await response.json();
      setProfile(prev => ({
        ...prev,
        problem: data,
      }));
    } catch (err) {
      console.error('Error fetching problem:', err);
    }
  };

  const updateProblem = async (description: string): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/problem/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update problem');
      }

      const data = await response.json();
      
      // Update the profile state in a safe way
      setProfile(prev => ({
        ...prev,
        problem: {
          description: data.description || description,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        }
      }));
      
      return true;
    } catch (err) {
      console.error('Error updating problem:', err);
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to update problem'
      );
      return false;
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      await loadProfileFromStorage();
      await fetchProblem();

      const storedProfile = await AsyncStorage.getItem('userData');
      const parsedProfile = storedProfile ? JSON.parse(storedProfile) : null;
      setProfile(parsedProfile);

      if (
        !parsedProfile ||
        !parsedProfile.lastUpdated ||
        Date.now() - parsedProfile.lastUpdated > REFRESH_INTERVAL
      ) {
        await fetchProfileFromAPI();
      }

      setLoading(false);
    };

    initializeProfile();

    const refreshInterval = setInterval(fetchProfileFromAPI, REFRESH_INTERVAL);
    return () => clearInterval(refreshInterval);
  }, []);
  const [editField, setEditField] = useState<
    'name' | 'company' | 'email' | 'problem' | null
  >(null);
  const gradientColors = [
    ['#FF6B6B', '#FF8E8E'], // Red
    ['#4ECDC4', '#45B7A8'], // Teal
    ['#45AAF2', '#2D98DA'], // Blue
    ['#FF9FF3', '#F368E0'], // Pink
    ['#FF4757', '#FF6B81'], // Logout Red
    ['#A29BFE', '#6C5CE7'], // Purple
  ];

  const handleUpdateProfile = async (
    field: keyof ProfileData,
    value: string,
  ) => {
    try {
      if (field === 'problem') {
        const success = await updateProblem(value);
        if (!success) {
          Alert.alert('Error', 'Failed to update problem');
        }
      } else {
        const success = await updateProfile(field, value);
        if (!success) {
          Alert.alert('Error', 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error in handleUpdateProfile:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while updating the profile'
      );
    }
  };

  const handleLogout = async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('refresh_token'),
      ]);

      if (accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{name: 'Landing'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      navigation.reset({
        index: 0,
        routes: [{name: 'Landing'}],
      });
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <SettingRow
              icon="person-outline"
              label="Username"
              value={profile.name}
              colors={gradientColors[0]}
              onPress={() => setEditField('name')}
            />
            <SettingRow
              icon="mail-outline"
              label="Email"
              value={profile.email}
              colors={gradientColors[1]}
              onPress={() => setEditField('email')}
            />
            <SettingRow
              icon="business-outline"
              label="Company"
              value={profile.company}
              colors={gradientColors[2]}
              onPress={() => setEditField('company')}
            />
            <SettingRow
              icon="help-circle-outline"
              label="Problem"
              value={profile.problem?.description || 'No problem description'}
              colors={gradientColors[3]}
              onPress={() => setEditField('problem')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <SettingRow
              icon="color-palette-outline"
              label="Theme"
              value="Light"
              colors={gradientColors[5]}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <SettingRow
              icon="document-text-outline"
              label="Terms and Conditions"
              colors={gradientColors[3]}
            />
            <Text style={styles.description}>
              Review the terms and conditions to understand your rights and
              responsibilities.
            </Text>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <SettingRow
            icon="log-out-outline"
            label="Logout"
            colors={gradientColors[4]}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
      <EditModal
        visible={editField !== null}
        onClose={() => setEditField(null)}
        onSave={(value) => {
          if (editField) {
            handleUpdateProfile(editField, value);
            setEditField(null);
          }
        }}
        value={
          editField === 'problem'
            ? profile.problem?.description || ''
            : editField
            ? profile[editField] || ''
            : ''
        }
        title={
          editField === 'problem'
            ? 'Update Problem'
            : editField
            ? `Update ${editField.charAt(0).toUpperCase() + editField.slice(1)}`
            : 'Update Field'
        }
        field={editField || 'name'}
      />
    </SafeAreaView>
  );
};

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    color: '#1E1E1E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowContent: {
    flex: 1,
    marginLeft: 16,
  },
  rowLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginTop: 8,
  },
  logoutSection: {
    marginTop: 'auto',
    marginBottom: 24,
  },
});

const extraStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E1E1E',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 12,
    marginLeft: 8,
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    color: 'white',
  },
});
const styles = StyleSheet.create({
  ...styles1,
  ...extraStyles,
});

export default SettingsScreen;
