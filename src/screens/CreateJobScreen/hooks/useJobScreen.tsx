import {useState, useEffect, useCallback} from 'react';
import {Alert, BackHandler, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {jobService} from '../services/jobService';
import {useJobForm} from './useJobForm';
import styles from '../styles';

export const useJobScreen = ({route, initialData}) => {
  const navigation = useNavigation();
  const mode = route.params?.mode || 'create';
  const jobId = route.params?.id;

  const {
    job,
    setJob,
    isLoading,
    setIsLoading,
    isEditing,
    setIsEditing,
    hasChanges,
    originalJob,
    showCreatedMessage,
    setShowCreatedMessage,
    jobUrl,
    setJobUrl,
    handleJobCreate,
    handleJobUpdate,
    handleJobDelete,
  } = useJobForm({initialData, jobId, mode});

  const [emailTemplate, setEmailTemplate] = useState({
    emailSubject: 'Shortlisted for Position',
    emailBody: `Dear Candidate,\n\nWe are pleased to inform you...`,
    useTemplate: true,
  });

  // Navigation handlers
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
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={backAction}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      ),
    });

    return () => backHandler.remove();
  }, [hasChanges, navigation, handleJobUpdate]);

  const handleSendEmail = useCallback(() => {
    jobService.sendEmail(emailTemplate);
  }, [emailTemplate]);

  return {
    job,
    isLoading,
    isEditing,
    showCreatedMessage,
    handleSave: handleJobUpdate,
    emailTemplate,
    setEmailTemplate,
    handleSendEmail,
  };
};
