import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import {API_URL} from '../../utils/constants';
import styles from './styles';

const CreateJobScreen = ({navigation, route}) => {
  const mode = route.params?.mode || 'create';
  const jobId = route.params?.id;
  const initialData = route.params?.initialData;

  // State management
  const [jobUrl, setJobUrl] = useState('');
  const [job, setJob] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState({
    emailSubject: 'Shortlisted for Position',
    emailBody: `Dear Candidate,\n\nWe are pleased to inform you that you have been shortlisted for the position. Please review the job details below and let us know if you're interested.\n\nBest regards,\nHiring Team`,
    useTemplate: true,
  });

  // Fetch job details if in view mode
  useEffect(() => {
    if (mode === 'view' && jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  // Handle back navigation with unsaved changes
  useEffect(() => {
    const backAction = () => {
      if (hasChanges) {
        Alert.alert('Unsaved Changes', 'Do you want to save your changes?', [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
          {text: 'Save', onPress: handleJobUpdate},
          {text: 'Cancel', style: 'cancel'},
        ]);
        return true;
      }
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [hasChanges, navigation]);

  // API functions
  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/jobs/${jobId}/`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (!response.ok) throw new Error('Failed to fetch job details');
      const data = await response.json();
      setJob(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobCreate = async () => {
    if (!jobUrl) {
      Alert.alert('Error', 'Please enter a LinkedIn job URL');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({linkedin_url: jobUrl}),
      });

      if (!response.ok) throw new Error('Failed to create job');
      const data = await response.json();
      setJob(data);
      setShowCreatedMessage(true);
      setIsEditing(true);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobUpdate = async () => {
    if (!job) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/jobs/${job.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) throw new Error('Failed to save job details');
      Alert.alert('Success', 'Job details saved successfully');
      setHasChanges(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save job details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    const recipient = 'candidate@example.com';
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      emailTemplate.emailSubject,
    )}&body=${encodeURIComponent(emailTemplate.emailBody)}`;
    Linking.openURL(mailtoUrl);
  };

  // Field update handler
  const updateField = (field, value, index, action) => {
    setJob(prevJob => {
      if (Array.isArray(prevJob[field])) {
        if (action === 'remove') {
          return {
            ...prevJob,
            [field]: prevJob[field].filter((_, i) => i !== index),
          };
        }
        if (action === 'add') {
          return {
            ...prevJob,
            [field]: [...prevJob[field], value],
          };
        }
        return {
          ...prevJob,
          [field]: prevJob[field].map((item, i) =>
            i === index ? value : item,
          ),
        };
      }
      return {
        ...prevJob,
        [field]: value,
      };
    });
    setHasChanges(true);
  };

  // Render form field
  const renderField = (label, value, field, readonly = false, multiline = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {Array.isArray(value) ? (
        <View style={styles.listContainer}>
          {value.map((item, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.listItemInput, readonly && styles.readonlyInput]}
                value={item}
                onChangeText={newValue => updateField(field, newValue, index)}
                editable={!readonly}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              {!readonly && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => updateField(field, null, index, 'remove')}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {!readonly && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => updateField(field, '', value.length, 'add')}>
              <Text style={styles.addButtonText}>+ Add {label}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TextInput
          style={[
            styles.input,
            multiline && styles.textArea,
            readonly && styles.readonlyInput,
          ]}
          value={value || ''}
          onChangeText={newValue => updateField(field, newValue)}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={!readonly}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </View>
  );

  // Render job creator section
  const renderJobCreator = () => {
    if (mode !== 'create' || job) return null;

    return (
      <>
        <Text style={styles.label}>LinkedIn Job URL</Text>
        <View style={styles.urlInputContainer}>
          <TextInput
            style={styles.urlInput}
            value={jobUrl}
            onChangeText={setJobUrl}
            placeholder="Paste LinkedIn job URL"
          />
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleJobCreate}
          disabled={isLoading}>
          <Text style={styles.createButtonText}>
            {isLoading ? 'Creating...' : 'Create Job'}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  // Render job form
  const renderJobForm = () => {
    if (!job) return null;

    return (
      <>
        <View style={styles.editHeader}>
          <View style={styles.headerContainer}>
            <Text style={styles.editHeaderText}>
              {isEditing ? 'Edit Job Details' : 'Job Details'}
            </Text>
            {mode === 'view' && (
              <TouchableOpacity
                style={styles.editButtonContainer}
                onPress={() => setIsEditing(!isEditing)}>
                <Text style={styles.editButtonText}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {renderField('Title', job.title, 'title', !isEditing)}
        {renderField('Company', job.company_name, 'company_name', !isEditing)}
        {renderField('Location', job.location, 'location', !isEditing)}
        {renderField('Required Skills', job.required_skills, 'required_skills', !isEditing)}
        {renderField('Preferred Skills', job.preferred_skills, 'preferred_skills', !isEditing)}
        {renderField('Required Experience', job.years_of_experience, 'required_experience', !isEditing)}
        {renderField('Education', job.education, 'education', !isEditing)}
        {renderField('Employment Type', job.employment_type, 'employment_type', !isEditing)}
        {renderField('Job Description', job.description, 'description', !isEditing, true)}
      </>
    );
  };

  // Render email template
  const renderEmailTemplate = () => {
    if (!job) return null;

    return (
      <View style={styles.emailSection}>
        <Text style={styles.sectionTitle}>Email Template</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Use Template</Text>
          <Switch
            value={emailTemplate.useTemplate}
            onValueChange={value =>
              setEmailTemplate(prev => ({...prev, useTemplate: value}))
            }
            trackColor={{false: '#767577', true: '#007AFF'}}
            thumbColor={emailTemplate.useTemplate ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <TextInput
          style={styles.input}
          value={emailTemplate.emailSubject}
          onChangeText={value =>
            setEmailTemplate(prev => ({...prev, emailSubject: value}))
          }
          editable={!emailTemplate.useTemplate}
          placeholder="Email Subject"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          value={emailTemplate.emailBody}
          onChangeText={value =>
            setEmailTemplate(prev => ({...prev, emailBody: value}))
          }
          multiline
          numberOfLines={6}
          editable={!emailTemplate.useTemplate}
          placeholder="Email Body"
        />

        <View style={styles.buttonGroup}>
          {mode !== 'view' && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleJobUpdate}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Saving...' : 'Save Job'}
              </Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={styles.emailButton} onPress={handleSendEmail}>
            <Text style={styles.buttonText}>Send Email</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.form}>
        {renderJobCreator()}

        {showCreatedMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.successMessage}>
              Job created successfully! You can now edit the details.
            </Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Creating job...</Text>
          </View>
        ) : (
          <>
            {renderJobForm()}
            {renderEmailTemplate()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateJobScreen;
