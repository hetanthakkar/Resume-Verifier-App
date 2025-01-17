import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import {JobForm} from './components/JobForm';
import {JobCreator} from './components/JobCreator';
import {EmailTemplate} from './components/EmailTemplate';
import {useJobScreen} from './hooks/useJobScreen';
import styles from './styles';

const JobScreen = ({navigation, route, initialData, onSave}) => {
  const {
    job,
    isLoading,
    isEditing,
    showCreatedMessage,
    handleSave,
    emailTemplate,
    setEmailTemplate,
    handleSendEmail,
  } = useJobScreen({navigation, route, initialData, onSave});
  //   const mode = route.params?.mode || 'create';
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <JobCreator
          mode={route.params?.mode || 'create'}
          job={job}
          isLoading={isLoading}
        />

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
            <JobForm
              job={job}
              isEditing={isEditing}
              mode={route.params?.mode}
            />

            <EmailTemplate
              emailTemplate={emailTemplate}
              setEmailTemplate={setEmailTemplate}
              handleSendEmail={handleSendEmail}
              handleSave={handleSave}
              isLoading={isLoading}
              mode={route.params?.mode}
              isEditing={isEditing}
            />
          </>
        ) : null}
      </View>
    </View>
  );
};
export default JobScreen;
