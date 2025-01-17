import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../styles';
export const JobCreator = ({
  mode,
  job,
  isLoading,
  jobUrl,
  setJobUrl,
  onCreateJob,
}) => {
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
        onPress={onCreateJob}
        disabled={isLoading}>
        <Text style={styles.createButtonText}>
          {isLoading ? 'Creating...' : 'Create Job'}
        </Text>
      </TouchableOpacity>
    </>
  );
};
