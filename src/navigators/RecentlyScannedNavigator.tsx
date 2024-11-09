import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecentlyScannedPdfsScreen from '../screens/RecentlyScannedPdfsScreen';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();
const RecentlyScannedStackNavigator = ({navigation}) => {
    return (
      <View style={{flex:1,backgroundColor:'red'}}>
      <RecentlyScannedPdfsScreen navigation={navigation}/>
      </View>
    );
  };
  
export default RecentlyScannedStackNavigator;