import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentlyScannedPdfsScreen from '../screens/RecentlyScannedPdfsScreen';
import PdfView from '../navigators/PdfTabNavigator';
import ChatScreen from '../screens/ChatScreen';

import {Text, View} from 'react-native';
import NotchSafeScreen from '../../NotchSafeScreen';

const Stack = createNativeStackNavigator();
const RecentlyScannedStackNavigator = ({navigation}) => {
  return (
    <NotchSafeScreen>
      <Stack.Navigator>
        <Stack.Screen
          name="Previous Chats"
          component={RecentlyScannedPdfsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            title: 'Chat',
            headerShown: true,
            headerBackTitleVisible: false
          }}
        />
        <Stack.Screen
          name="PdfView"
          component={PdfView}
          options={{
            title: 'PDF View',
          }}
        />
      </Stack.Navigator>
    </NotchSafeScreen>
  );
};

export default RecentlyScannedStackNavigator;
