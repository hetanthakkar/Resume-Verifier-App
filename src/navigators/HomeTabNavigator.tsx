import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import JobsStackNavigator from './JobsStackNavigator';
import RecentlyScannedPdfsScreen from '../navigators/RecentlyScannedNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { RouteNameContext } from '../../App';
import { useTheme } from '../theme/ThemeContext';

const BottomTab = createMaterialBottomTabNavigator();

const HomeTabNavigator = () => {
  const routeNameContext = React.useContext(RouteNameContext);
  const { theme } = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Jobs"
      activeColor="#007AFF"
      inactiveColor="#8E8E93"
      barStyle={[
        styles.tabBar,
        { display: routeNameContext?.currentRouteName === 'InnerHome' ? 'none' : 'flex',},
        {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.tabBar,
        },
      ]}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Recently Scanned') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.textInverse,
        tabBarInactiveTintColor: theme.colors.textInverse + '80',
      })}
    >
      <BottomTab.Screen name="Jobs" component={JobsStackNavigator} />
      <BottomTab.Screen name="Recently Scanned" component={RecentlyScannedPdfsScreen} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HomeTabNavigator;