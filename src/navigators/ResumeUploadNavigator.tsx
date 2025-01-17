import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PdfViewNavigator from '../navigators/PdfTabNavigator';
import PdfUploadScreen from '../screens/ResumeUploadScreen';
import NotchSafeScreen from '../../NotchSafeScreen';

const Stack = createNativeStackNavigator();

const ResumeUploadNavigator = ({route}) => {
  const {id, job} = route.params;
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        initialParams={{id: id, job: job}}
        name="ResumeUpload"
        component={PdfUploadScreen}
      />
      <Stack.Screen
        name="PdfView"
        component={PdfViewNavigator}
        options={{
          title: 'PDF View',
        }}
      />
    </Stack.Navigator>
  );
};

export default ResumeUploadNavigator;
