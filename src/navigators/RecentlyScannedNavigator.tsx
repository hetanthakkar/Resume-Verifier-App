import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecentlyScannedPdfsScreen from '../screens/RecentlyScannedPdfsScreen';
import PdfView from '../navigators/PdfTabNavigator';

import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();
const RecentlyScannedStackNavigator = ({navigation}) => {
    return (

      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Recently Scanned CVs" component={RecentlyScannedPdfsScreen} />
      <Stack.Screen 
          name="PdfView" 
          component={PdfView} 
          options={{ 
            title: 'PDF View', 
          }} 
        />
    </Stack.Navigator>
      // <View style={{flex:1,backgroundColor:'red'}}>
      // <RecentlyScannedPdfsScreen navigation={navigation}/>
      // <PdfView navigation={navigation}/>
      // {/* <Stack.Screen 
      //     name="PdfView" 
      //     component={PdfView} 
      //     options={{ 
      //       title: 'PDF View', 
      //     }} 
      //   /> */}
      // </View>
    );
  };
  
export default RecentlyScannedStackNavigator;