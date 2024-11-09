import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RecentlyScannedPdfsScreen from '../navigators/RecentlyScannedNavigator';
import ShortlistedPdfsScreen from '../navigators/ShortlistedTabNavigator';
import CreateJob from '../screens/CreateJobScreen';
import { RouteNameContext } from '../../App';

const TopTab = createMaterialTopTabNavigator();

const JobTabNavigator = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const showTabs = route.params?.showTabs !== false;
  const { currentRouteName } = React.useContext(RouteNameContext);

  useEffect(() => {
    navigation.getParent()?.getParent()?.getParent()?.setOptions({
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

  return (
    <>
      {/* Style 1: Balanced Header with Title */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Job</Text>
        <View style={styles.rightPlaceholder} />
      </View> */}

      {/* Style 2: Compact Header (Uncomment to use)
      <View style={styles.headerCompact}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButtonCompact}>
          <Icon name="arrow-back" size={24} color="#333" />
          <Text style={styles.backTextCompact}>Back</Text>
        </TouchableOpacity>
      </View>
      */}

      {/* Style 3: iOS-Style Header (Uncomment to use) */}
     {currentRouteName!="InnerHome" && <View style={styles.headerIOS}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButtonIOS}>
            <Icon name="chevron-back" size={24} color="#007AFF" />
            {/* <Text style={styles.backTextIOS}>Back</Text> */}
          </TouchableOpacity>
          <Text style={styles.headerTitleIOS}>Create Job</Text>
        </View>
      </View>}
     

      <TopTab.Navigator>
        <TopTab.Screen
          name="JobDescription"
          component={CreateJob}
          options={{ title: 'Job Description' }}
        />
        <TopTab.Screen
          name="ShortlistedPdfs"
          component={ShortlistedPdfsScreen}
          options={{ title: 'Shortlisted PDFs' }}
        />
      </TopTab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  // Style 1: Balanced Header with Title
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  rightPlaceholder: {
    flex: 1,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },

  // Style 2: Compact Header
  headerCompact: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backTextCompact: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },

  // Style 3: iOS-Style Header
  headerIOS: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonIOS: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitleIOS: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  backTextIOS: {
    marginLeft: 5,
    fontSize: 17,
    color: '#007AFF',
  },
});

export default JobTabNavigator;