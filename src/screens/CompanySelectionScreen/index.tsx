import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

type RootStackParamList = {
  CompanySelection: {
    googleUser: any;
    user: any;
    accessToken: string;
    refreshToken: string;
  };
  Home: undefined;
};

type CompanySelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'CompanySelection'>;

const CompanySelectionScreen: React.FC<CompanySelectionScreenProps> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const { googleUser, user, accessToken, refreshToken } = route.params;

  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = Platform.select({
    ios: 'http://localhost:8000',
    android: 'http://10.0.2.2:8000',
  });
  const handleSubmit = async () => {
    if (!company.trim() || isLoading) return;
    
    setIsLoading(true);
  
    try {
      // Update the user profile with company information
      const response = await fetch(`${API_URL}/api/profile/update/`, {  // Changed from /api/auth/update-profile/
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          company: company.trim(),
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        // Update stored user data with company information
        const updatedUser = { ...user, company: company.trim() };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Navigate to home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Error', data.error || 'Failed to update company information');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      Alert.alert('Error', 'Failed to update company information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 40,
          }}
          showsVerticalScrollIndicator={false}>
          
          <View style={{ marginBottom: 40 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: 8,
            }}>
              Welcome, {user?.name || googleUser?.name}!
            </Text>
            <Text style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
              lineHeight: 24,
            }}>
              Please tell us which company you work for to complete your profile.
            </Text>
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: 12,
            }}>
              Company Name
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 16,
                fontSize: 16,
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              }}
              value={company}
              onChangeText={setCompany}
              placeholder="Enter your company name"
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="words"
              autoComplete="organization"
              editable={!isLoading}
            />
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={{
              backgroundColor: company.trim() ? '#007AFF' : '#E5E7EB',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 24,
            }}
            onPress={handleSubmit}
            disabled={!company.trim() || isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: company.trim() ? '#FFFFFF' : '#9CA3AF',
              }}>
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default CompanySelectionScreen; 