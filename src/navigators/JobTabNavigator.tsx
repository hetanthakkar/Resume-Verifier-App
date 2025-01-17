import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ShortlistedNavigator from '../navigators/ShortlistedTabNavigator';
import ResumeUploadNavigator from '../navigators/ResumeUploadNavigator';

import CreateJob from '../screens/CreateJobScreen';
import {RouteNameContext} from '../../App';

const TopTab = createMaterialTopTabNavigator();

const JobTabNavigator = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const showTabs = route.params?.showTabs !== false;
  const {currentRouteName} = React.useContext(RouteNameContext);
  useEffect(() => {
    navigation
      .getParent()
      ?.getParent()
      ?.getParent()
      ?.setOptions({
        tabBarStyle: {
          display: 'none',
          backgroundColor: 'pink',
        },
      });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (!showTabs) {
    return <ShortlistedPdfsScreen />;
  }
  const {id, mode, job} = route.params;

  return (
    <>
      {currentRouteName !== 'InnerHome' && (
        <View style={styles.headerIOS}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backText}></Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
        </View>
      )}
      <TopTab.Navigator>
        <TopTab.Screen
          name="UploadResume"
          initialParams={{id, mode, job}}
          component={ResumeUploadNavigator}
          options={{title: 'Upload'}}
        />
        <TopTab.Screen
          name="JobDescription"
          component={CreateJob}
          initialParams={{id, mode}}
          options={{title: 'Details'}}
        />
        <TopTab.Screen
          name="ShortlistedPdfs"
          initialParams={{id, mode}}
          component={ShortlistedNavigator}
          options={{title: 'Shortlisted'}}
        />
      </TopTab.Navigator>
    </>
  );
};
const styles = StyleSheet.create({
  headerIOS: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    // paddingTop: 44, // Adds proper spacing for iOS status bar
    height: 68, // Total height including status bar
    justifyContent: 'flex-end', // Aligns content to bottom
    paddingBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: -4, // Tightens spacing between icon and text
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 40, // Ensures title doesn't overlap with back button
  },
});
export default JobTabNavigator;
