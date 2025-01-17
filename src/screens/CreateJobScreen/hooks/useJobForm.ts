import {useState, useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {jobService} from '../services/jobService';

export const useJobForm = ({initialData, jobId, mode}) => {
  const [jobUrl, setJobUrl] = useState('');
  const [job, setJob] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalJob, setOriginalJob] = useState(initialData || null);
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);

  useEffect(() => {
    if (mode === 'view' && jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const data = await jobService.fetchJob(jobId);
      setJob(data);
      setOriginalJob(data);
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
      const data = await jobService.createJob(jobUrl);
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

  const handleJobUpdate = async () => {
    if (!job) return;

    setIsLoading(true);
    try {
      await jobService.updateJob(job);
      Alert.alert('Success', 'Job details saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save job details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = useCallback((field, value, index, action) => {
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
  }, []);

  return {
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
    updateField,
  };
};
