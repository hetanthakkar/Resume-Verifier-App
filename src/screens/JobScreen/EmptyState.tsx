import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface EmptyStateProps {
  onCreatePress: () => void;
  onJoinPress: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onCreatePress,
  onJoinPress,
}) => {
  const { theme } = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
          color: theme.colors.text,
        }}>
        No Jobs Available
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          marginBottom: 24,
        }}>
        Create a new job or join a group to get started
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 16,
        }}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            },
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={onCreatePress}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Create Job
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            },
            {
              backgroundColor: theme.colors.success,
            },
          ]}
          onPress={onJoinPress}>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '600',
            }}>
            Join Job
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmptyState; 