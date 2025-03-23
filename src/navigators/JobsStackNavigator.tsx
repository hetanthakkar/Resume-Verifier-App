import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import JobsScreen from '../screens/JobScreen/index';
import CreateJobScreen from '../screens/CreateJobScreen';
import JobTabNavigator from './JobTabNavigator';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

const JobsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="MainJob"
        component={JobsScreen}
        options={{title: 'Jobs'}}
      />
      <Stack.Screen
        name="CreateJob"
        component={CreateJobScreen}
        options={{
          title: 'Create Job',
          headerShown: true,
          // headerBackButtonMenuEnabled: true,
        }}
      />
      {/* <Stack.Screen
        name="JobTab"
        component={JobTabNavigator}
        options={{title: 'Job Description'}}
      /> */}
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default JobsStackNavigator;
