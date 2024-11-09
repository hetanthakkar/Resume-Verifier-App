import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  rightIcon?: string;
  colors: string[];
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  value,
  rightIcon,
  colors,
}) => (
  <TouchableOpacity>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.row}
    >
      <Ionicons name={icon} size={24} color="#FFFFFF" />
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      <Ionicons name={rightIcon || 'chevron-forward'} size={24} color="#FFFFFF" />
    </LinearGradient>
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const gradientColors = [
    ['#FF6B6B', '#FF8E8E'], // Red
    ['#4ECDC4', '#45B7A8'], // Teal
    ['#45AAF2', '#2D98DA'], // Blue
    ['#FF9FF3', '#F368E0'], // Pink
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.section}>
          <SettingRow
            icon="person-outline"
            label="Name"
            value="John Doe"
            rightIcon="pencil-outline"
            colors={gradientColors[0]}
          />
          <SettingRow
            icon="mail-outline"
            label="Email"
            value="john.doe@example.com"
            rightIcon="pencil-outline"
            colors={gradientColors[1]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingRow
            icon="color-palette-outline"
            label="Theme"
            value="Light"
            colors={gradientColors[2]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <SettingRow
            icon="document-text-outline"
            label="Terms and Conditions"
            colors={gradientColors[3]}
          />
          <Text style={styles.description}>
            Review the terms and conditions to understand your rights and responsibilities.
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    // opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    color: '#1E1E1E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowContent: {
    flex: 1,
    marginLeft: 16,
  },
  rowLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginTop: 8,
  },
});

export default SettingsScreen;
