import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Slider from '@react-native-community/slider';

interface RangeSliderProps {
  label: string;
  value: [number, number];
  setValue: (value: [number, number]) => void;
  min: number;
  max: number;
  disabled: boolean;
}

type JobMode = 'create' | 'edit' | 'view';

interface Job {
  jobLink: string;
  jobTitle: string;
  github: [number, number];
  experience: [number, number];
  gpa: [number, number];
  emailSubject: string;
  emailBody: string;
  useTemplate: boolean;
}

interface JobScreenProps {
  navigation: any;
  mode: JobMode;
  initialData?: Job; // For edit and view modes
  onSave?: (jobData: Job) => Promise<void>; // For create and edit modes
}

const JobScreen: React.FC<JobScreenProps> = ({
  navigation,
  mode,
  initialData,
  onSave,
}) => {
  // States for form data
  const [jobLink, setJobLink] = useState<string>(
    initialData?.jobLink || 'https://company.com/jobs/12345'
  );
  const [jobTitle, setJobTitle] = useState<string>(
    initialData?.jobTitle || 'Senior Software Engineer'
  );
  const [github, setGithub] = useState<[number, number]>(
    initialData?.github || [20, 85]
  );
  const [experience, setExperience] = useState<[number, number]>(
    initialData?.experience || [15, 95]
  );
  const [gpa, setGpa] = useState<[number, number]>(
    initialData?.gpa || [30, 100]
  );
  const [useTemplate, setUseTemplate] = useState<boolean>(
    initialData?.useTemplate ?? true
  );
  const [emailSubject, setEmailSubject] = useState<string>(
    initialData?.emailSubject || 'Shortlisted for Software Engineer Position'
  );
  const [emailBody, setEmailBody] = useState<string>(
    initialData?.emailBody || 
    `Dear Candidate,

We are pleased to inform you that you have been shortlisted for the position of Software Engineer at our company. Your qualifications and experience have impressed our hiring team, and we would like to invite you for an interview.

Please let us know your availability for the next week, and we will schedule the interview accordingly.

Best regards,
Recruiting Team`
  );
  const [modifyPreferences, setModifyPreferences] = useState<boolean>(mode !== 'view');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get screen title based on mode
  const getScreenTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create Job';
      case 'edit':
        return 'Edit Job';
      case 'view':
        return 'View Job';
      default:
        return 'Job Details';
    }
  };

  const RangeSlider: React.FC<RangeSliderProps> = ({
    label,
    value,
    setValue,
    min,
    max,
    disabled,
  }) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E1E1E6"
          thumbTintColor="#007AFF"
          value={value[0]}
          onValueChange={val => setValue([val, value[1]])}
          disabled={disabled}
        />
      </View>
      <View style={styles.sliderValues}>
        <Text style={styles.sliderValueText}>{min}</Text>
        <Text style={styles.sliderValueText}>{max}</Text>
      </View>
    </View>
  );

  const handleSendEmail = () => {
    const recipient = 'candidate@example.com';
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      emailSubject,
    )}&body=${encodeURIComponent(emailBody)}`;
    Linking.openURL(mailtoUrl);
  };

  const handleSave = async () => {
    if (mode === 'view') return;

    setIsLoading(true);
    try {
      const jobData: Job = {
        jobLink,
        jobTitle,
        github,
        experience,
        gpa,
        emailSubject,
        emailBody,
        useTemplate,
      };

      await onSave?.(jobData);
      Alert.alert('Success', 'Job details saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save job details');
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = () => {
    switch (mode) {
      case 'create':
        return (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSave}
            disabled={isLoading}>
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating...' : 'Create Job'}
            </Text>
          </TouchableOpacity>
        );
      case 'edit':
        return (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSave}
              disabled={isLoading}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleSendEmail}>
              <Text style={styles.submitButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        );
      case 'view':
        return (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.replace('JobScreen', { mode: 'edit', initialData: {
                jobLink,
                jobTitle,
                github,
                experience,
                gpa,
                emailSubject,
                emailBody,
                useTemplate,
              }})}>
              <Text style={styles.submitButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emailButton}
              onPress={handleSendEmail}>
              <Text style={styles.submitButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Job Link</Text>
          <TextInput
            style={[styles.input, mode === 'view' && styles.readOnlyInput]}
            value={jobLink}
            onChangeText={setJobLink}
            editable={mode !== 'view'}
            placeholderTextColor="#A0A0A0"
          />
          
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={[styles.input, mode === 'view' && styles.readOnlyInput]}
            value={jobTitle}
            onChangeText={setJobTitle}
            editable={mode !== 'view'}
            placeholderTextColor="#A0A0A0"
          />

          {mode !== 'view' && (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Modify Preferences</Text>
              <Switch
                value={modifyPreferences}
                onValueChange={setModifyPreferences}
                trackColor={{false: '#767577', true: '#007AFF'}}
                thumbColor={modifyPreferences ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>
          )}

          <RangeSlider
            label="GitHub"
            value={github}
            setValue={setGithub}
            min={20}
            max={85}
            disabled={!modifyPreferences || mode === 'view'}
          />
          <RangeSlider
            label="Experience"
            value={experience}
            setValue={setExperience}
            min={15}
            max={95}
            disabled={!modifyPreferences || mode === 'view'}
          />
          <RangeSlider
            label="GPA"
            value={gpa}
            setValue={setGpa}
            min={30}
            max={100}
            disabled={!modifyPreferences || mode === 'view'}
          />

          <Text style={styles.label}>Email Composition</Text>
          {mode !== 'view' && (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Use Template</Text>
              <Switch
                value={useTemplate}
                onValueChange={setUseTemplate}
                trackColor={{false: '#767577', true: '#007AFF'}}
                thumbColor={useTemplate ? '#FFFFFF' : '#f4f3f4'}
                disabled={mode === 'view'}
              />
            </View>
          )}

          <Text style={styles.label}>Email Subject</Text>
          <TextInput
            style={[styles.input, mode === 'view' && styles.readOnlyInput]}
            value={emailSubject}
            onChangeText={setEmailSubject}
            editable={!useTemplate && mode !== 'view'}
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Email Body</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              mode === 'view' && styles.readOnlyInput,
            ]}
            value={emailBody}
            onChangeText={setEmailBody}
            multiline
            numberOfLines={6}
            editable={!useTemplate && mode !== 'view'}
            placeholderTextColor="#A0A0A0"
          />

          {renderActionButton()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 25,
    color: '#708090',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  form: {
    padding: 16,
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
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#1E1E1E',
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D0D0D0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1E1E1E',
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderValueText: {
    color: '#1E1E1E',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    overflow: 'hidden',
  },
  editButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  emailButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#FF9800',
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
});

export default JobScreen;