import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentlyScannedPdfsScreen from '../screens/RecentlyScannedPdfsScreen';
import PdfView from '../navigators/PdfTabNavigator';

import {Text, View} from 'react-native';
import NotchSafeScreen from '../../NotchSafeScreen';

const Stack = createNativeStackNavigator();
const RecentlyScannedStackNavigator = ({navigation}) => {
  return (
    <NotchSafeScreen>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Recently Scanned CVs"
          component={RecentlyScannedPdfsScreen}
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
