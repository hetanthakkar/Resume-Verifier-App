import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import JobsStackNavigator from './JobsStackNavigator';
import RecentlyScannedPdfsScreen from '../navigators/RecentlyScannedNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { RouteNameContext } from '../../App';

const BottomTab = createMaterialBottomTabNavigator();

const HomeTabNavigator = () => {
  const { currentRouteName } = React.useContext(RouteNameContext);


  return (
    <BottomTab.Navigator
    initialRouteName="Jobs"
      activeColor="#007AFF"
      inactiveColor="#8E8E93"
      barStyle={[
        styles.tabBar,
        { display: currentRouteName === 'InnerHome' ? 'none' : 'flex',},
      ]}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          switch (route.name) {
            case 'Jobs':
              iconName = 'briefcase-outline';
              break;
            case 'Candidates':
              iconName = 'people-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
              break;
          }
          return <Icon name={iconName} color={color} size={24} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      })}
    >
      <BottomTab.Screen name="Jobs" component={JobsStackNavigator} />
      <BottomTab.Screen name="Candidates" component={RecentlyScannedPdfsScreen} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
  },
});

export default HomeTabNavigator;