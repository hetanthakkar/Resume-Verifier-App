import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PdfView from '../navigators/PdfTabNavigator';
import ShortlistedPdfsScreen from '../screens/ShortlistedPdfsScreen';
import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const ShortlistNavigator = ({route}) => {
  const {id} = route.params; // Extract `id` from `route.params`
  console.log('aosidfnaiosdnf', id);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        initialParams={{id: id}}
        name="Shortlisted Candidates"
        component={ShortlistedPdfsScreen}
      />
      <Stack.Screen
        name="PdfView"
        component={PdfView}
        options={{
          title: 'PDF View',
        }}
      />
    </Stack.Navigator>
  );
};

export default ShortlistNavigator;
