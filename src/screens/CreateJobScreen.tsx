import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Alert,
  BackHandler,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api', // Android emulator localhost equivalent
});
const JobScreen = ({navigation, route, initialData, onSave}) => {
  const mode = route.params?.mode || 'create';
  const jobId = route.params?.id;
  const [jobUrl, setJobUrl] = useState('');
  const [job, setJob] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalJob, setOriginalJob] = useState(initialData || null);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch job details');

      const data = await response.json();
      setJob(data);
      setOriginalJob(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (mode === 'view' && jobId) {
      fetchJobDetails();
    }
  }, [jobId]);
  const handleSave = async () => {
    if (!job) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const body = JSON.stringify(job);

      const curlCommand = `
      curl -X PUT '${API_BASE_URL}/jobs/${job.id}/' \\
      -H 'Content-Type: application/json' \\
      -H 'Authorization: Bearer ${token}' \\
      -d '${body}'
      `;

      // Log the cURL command to the console
      console.log('cURL Request:');
      console.log(curlCommand);

      const response = await fetch(`${API_BASE_URL}/jobs/${job.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      console.log('response change', response);
      if (!response.ok) {
        throw new Error('Failed to save job details');
      }

      Alert.alert('Success', 'Job details saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save job details');
    } finally {
      setIsLoading(false);
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(job) !== JSON.stringify(originalJob);
  }, [job, originalJob]);
  useEffect(() => {
    const backAction = () => {
      if (hasChanges) {
        Alert.alert('Unsaved Changes', 'Do you want to save your changes?', [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Save',
            onPress: handleSave,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
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

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={backAction}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      ),
    });

    return () => backHandler.remove();
  }, [hasChanges, navigation, handleSave]);

  const handleBackPress = useCallback(async () => {
    if (hasUnsavedChanges()) {
      Alert.alert('Unsaved Changes', 'Do you want to save your changes?', [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            navigation.setParams({hasUnsavedChanges: false});
            navigation.goBack();
          },
        },
        {
          text: 'Save',
          onPress: async () => {
            await handleSave();
            navigation.setParams({hasUnsavedChanges: false});
            navigation.goBack();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
      return true;
    }
    navigation.goBack();
    return false;
  }, [navigation, hasUnsavedChanges, handleSave]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleBackPress}>
          <Text>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleBackPress]);
  const [emailTemplate, setEmailTemplate] = useState({
    emailSubject: 'Shortlisted for Position',
    emailBody: `Dear Candidate,

We are pleased to inform you that you have been shortlisted for the position at our company. Your qualifications and experience have impressed our hiring team, and we would like to invite you for an interview.

Please let us know your availability for the next week, and we will schedule the interview accordingly.

Best regards,
Recruiting Team`,
    useTemplate: true,
  });

  const createJob = async () => {
    if (!jobUrl) {
      Alert.alert('Error', 'Please enter a LinkedIn job URL');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          linkedin_url: jobUrl,
        }),
      });

      if (!response.ok) {
        console.log('response', response);
        throw new Error('Failed to create job');
      }

      const data = await response.json();
      setJob(data);
      setOriginalJob(data);
      setShowCreatedMessage(true);
      setIsEditing(true);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const updateJobField = useCallback((field, value) => {
    setJob(prevJob => ({
      ...prevJob,
      [field]: value,
    }));
    setHasChanges(true);
  }, []);

  const updateArrayField = useCallback((field, value, index) => {
    setJob(prevJob => ({
      ...prevJob,
      [field]: prevJob[field].map((item, i) => (i === index ? value : item)),
    }));
    setHasChanges(true);
  }, []);

  const addArrayItem = field => {
    setJob(prevJob => ({
      ...prevJob,
      [field]: [...prevJob[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setJob(prevJob => ({
      ...prevJob,
      [field]: prevJob[field].filter((_, i) => i !== index),
    }));
  };
  const handleDiscard = async () => {
    if (job?.id) {
      try {
        await fetch(`${API_BASE_URL}/jobs/${job.id}`, {
          method: 'DELETE',
        });
        console.log('job deleted');
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
    navigation.goBack();
  };

  const handleSendEmail = () => {
    const recipient = 'candidate@example.com';
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      emailTemplate.emailSubject,
    )}&body=${encodeURIComponent(emailTemplate.emailBody)}`;
    Linking.openURL(mailtoUrl);
  };

  const renderField = (
    label,
    value,
    field,
    readonly = false,
    multiline = false,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {Array.isArray(value) ? (
        <View style={styles.listContainer}>
          {value.map((item, index) => (
            <View key={index} style={styles.listItemContainer}>
              <TextInput
                style={[styles.listItemInput, readonly && styles.readonlyInput]}
                value={item}
                onChangeText={newValue =>
                  updateArrayField(field, newValue, index)
                }
                editable={!readonly && !isEditing}
              />
              {!readonly && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeArrayItem(field, index)}>
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {!readonly && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addArrayItem(field)}>
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
          value={value}
          onChangeText={newValue => updateJobField(field, newValue)}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={!readonly}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          {mode === 'create' && !job && (
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
                onPress={createJob}
                disabled={isLoading}>
                <Text style={styles.createButtonText}>
                  {isLoading ? 'Creating...' : 'Create Job'}
                </Text>
              </TouchableOpacity>
            </>
          )}
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
              <Text style={styles.loadingText}>Creating job ...</Text>
            </View>
          ) : job ? (
            <>
              <View style={styles.editHeader}>
                <View style={styles.headerContainer}>
                  <Text style={styles.editHeaderText}>
                    {isEditing ? 'Edit Job Details' : 'Job Details'}
                  </Text>
                  {mode === 'view' && (
                    <TouchableOpacity
                      style={styles.editButtonContainer}
                      onPress={toggleEdit}>
                      <Text style={styles.editButtonText}>
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {renderField('Title', job.title, 'title', !isEditing)}
              {renderField(
                'Company',
                job.company_name,
                'company_name',
                !isEditing,
              )}
              {renderField('Location', job.location, 'location', !isEditing)}
              {renderField(
                'Required Skills',
                job.required_skills,
                'required_skills',
                !isEditing,
              )}
              {renderField(
                'Preferred Skills',
                job.preferred_skills,
                'preferred_skills',
                !isEditing,
              )}
              {renderField(
                'Required Experience',
                job.years_of_experience,
                'required_experience',
                !isEditing,
              )}
              {renderField('Education', job.education, 'education', !isEditing)}
              {renderField(
                'Employment Type',
                job.employment_type,
                'employment_type',
                !isEditing,
              )}
              {renderField(
                'Job Description',
                job.description,
                'description',
                !isEditing,
                true,
              )}

              <View style={styles.emailSection}>
                <Text style={styles.sectionTitle}>Email Template</Text>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Use Template</Text>
                  <Switch
                    value={emailTemplate.useTemplate}
                    onValueChange={value =>
                      setEmailTemplate(prev => ({
                        ...prev,
                        useTemplate: value,
                      }))
                    }
                    trackColor={{false: '#767577', true: '#007AFF'}}
                    thumbColor={
                      emailTemplate.useTemplate ? '#FFFFFF' : '#f4f3f4'
                    }
                  />
                </View>

                <TextInput
                  style={styles.input}
                  value={emailTemplate.emailSubject}
                  onChangeText={value =>
                    setEmailTemplate(prev => ({
                      ...prev,
                      emailSubject: value,
                    }))
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
                />

                <View style={styles.buttonGroup}>
                  {mode !== 'view' && (
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                      disabled={isLoading}>
                      <Text style={styles.buttonText}>
                        {isLoading ? 'Saving...' : 'Save Job'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.emailButton}
                    onPress={handleSendEmail}>
                    <Text style={styles.buttonText}>Send Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  form: {
    padding: 16,
  },
  urlInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  fetchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1E1E1E',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E1E1E',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchLabel: {
    fontSize: 16,
    color: '#1E1E1E',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  emailButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: '#DFF0D8',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  successMessage: {
    color: '#3C763D',
    fontSize: 16,
    textAlign: 'center',
  },
  editHeader: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  editHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  readonlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  editButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  editHeaderText: {
    fontSize: 20,
    fontWeight: '600',
  },
  editButtonContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default JobScreen;
