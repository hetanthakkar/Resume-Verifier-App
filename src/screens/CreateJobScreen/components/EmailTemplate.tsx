import React from 'react';
import {View, Text, TextInput, TouchableOpacity, Switch} from 'react-native';
import styles from '../styles';

export const EmailTemplate = ({
  emailTemplate,
  setEmailTemplate,
  handleSendEmail,
  handleSave,
  isLoading,
  mode,
  isEditing,
}) => (
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
      <TouchableOpacity style={styles.emailButton} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Send Email</Text>
      </TouchableOpacity>
    </View>
  </View>
);
