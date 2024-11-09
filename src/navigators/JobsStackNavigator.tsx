import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobsScreen from '../screens/JobsScreen';
import CreateJobScreen from '../screens/CreateJobScreen';
import JobTabNavigator from './JobTabNavigator';

const Stack = createNativeStackNavigator();

const JobsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="MainJob" component={JobsScreen} options={{ title: 'Jobs' }} />
      <Stack.Screen name="CreateJob" component={CreateJobScreen} options={{ title: 'Create Job' }} />
      <Stack.Screen name="JobTab" component={JobTabNavigator} options={{ title: 'Job Description' }} />
    </Stack.Navigator>
  );
};

export default JobsStackNavigator;