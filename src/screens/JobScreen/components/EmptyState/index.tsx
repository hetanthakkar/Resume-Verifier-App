import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface EmptyStateProps {
  onCreatePress: () => void;
  onJoinPress: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onCreatePress,
  onJoinPress,
}) => (
  <View style={styles.container}>
    <Text style={styles.title}>No Jobs Available</Text>
    <Text style={styles.subtitle}>
      Create a new job or join a group to get started
    </Text>
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.createButton]}
        onPress={onCreatePress}>
        <Text style={styles.actionButtonText}>Create Job</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.joinButton]}
        onPress={onJoinPress}>
        <Text style={styles.joinButtonText}>Join Job</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default EmptyState;
