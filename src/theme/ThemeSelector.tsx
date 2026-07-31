import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from './ThemeContext';
import { ThemeMode } from './theme';

interface ThemeOptionProps {
  mode: ThemeMode;
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  mode,
  label,
  icon,
  isSelected,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
        },
      ]}
      onPress={onPress}>
      <View style={styles.optionContent}>
        <Ionicons
          name={icon as any}
          size={24}
          color={isSelected ? theme.colors.textInverse : theme.colors.text}
        />
        <Text
          style={[
            styles.optionLabel,
            {
              color: isSelected ? theme.colors.textInverse : theme.colors.text,
            },
          ]}>
          {label}
        </Text>
      </View>
      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={theme.colors.textInverse}
        />
      )}
    </TouchableOpacity>
  );
};

const ThemeSelector: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themeOptions = [
    {
      mode: 'light' as ThemeMode,
      label: 'Light',
      icon: 'sunny',
    },
    {
      mode: 'dark' as ThemeMode,
      label: 'Dark',
      icon: 'moon',
    },
    {
      mode: 'system' as ThemeMode,
      label: 'System',
      icon: 'settings',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Choose Theme
      </Text>
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <ThemeOption
            key={option.mode}
            mode={option.mode}
            label={option.label}
            icon={option.icon}
            isSelected={themeMode === option.mode}
            onPress={() => setThemeMode(option.mode)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ThemeSelector; 