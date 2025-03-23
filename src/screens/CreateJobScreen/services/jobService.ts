import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import {API_BASE_URL} from '../../JobScreen/utils/api';

export const jobService = {
  async fetchJob(jobId) {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/`, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (!response.ok) throw new Error('Failed to fetch job details');
    return response.json();
  },

  async createJob(jobUrl) {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({linkedin_url: jobUrl}),
    });

    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  },

  async updateJob(job) {
    const token = await AsyncStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/jobs/${job.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) throw new Error('Failed to save job details');
    return response.json();
  },

  sendEmail(emailTemplate) {
    const recipient = 'candidate@example.com';
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      emailTemplate.emailSubject,
    )}&body=${encodeURIComponent(emailTemplate.emailBody)}`;
    Linking.openURL(mailtoUrl);
  },
};
