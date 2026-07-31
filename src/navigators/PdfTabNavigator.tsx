import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import PDFViewScreen from '../screens/PDFViewScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SummaryViewScreen from '../screens/SummaryViewScreen';
import CommentsScreen from '../screens/CommentsScreen';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabBarIcon = ({name, focused, color}) => (
  <View style={styles.iconContainer}>
    <Icon name={name} size={24} color={color} />
    {focused && <View style={styles.dot} />}
  </View>
);

const PdfStackNavigator = ({route}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="PdfTabNavigator"
        component={PdfTabNavigator}
        initialParams={route.params}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const PdfTabNavigator = props => {
  const navigation = useNavigation();
  useEffect(() => {
    const hideAllTabBars = () => {
      const currentOptions = navigation.getParent()?.getState()?.routes;
      // const tabBarStyle = navigation.getParent()?.;
      let currentNav = navigation;
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: 'none',
        },
      });
    };

    hideAllTabBars();

    return () => {
      let currentNav = navigation;
      while (currentNav?.getParent()) {
        currentNav.getParent()?.setOptions({
          tabBarStyle: undefined,
        });
        currentNav = currentNav.getParent();
      }
    };
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle:
          route.name === 'PdfView' ? {display: 'none'} : styles.tabBar,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}>
      <Tab.Screen
        initialParams={{
          uri: props.route.params.uri,
          fileName: props.route.params.fileName,
          job: props.route.params.job,
          analysisData: props.route.params.analysisData,
          resume_id: props.route.params.resume_id,
        }}
        name="PDFView"
        component={PDFViewScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabBarIcon
              name="document-text-outline"
              focused={focused}
              color={color}
            />
          ),
          tabBarLabel: 'PDF',
        }}
      />
      <Tab.Screen
        initialParams={{
          uri: props.route.params.uri,
          fileName: props.route.params.fileName,
          job: props.route.params.job,
          analysisData: props.route.params.analysisData,
        }}
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabBarIcon
              name="bar-chart-outline"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        initialParams={{
          uri: props.route.params.uri,
          fileName: props.route.params.fileName,
          job: props.route.params.job,
          analysisData: props.route.params.analysisData,
        }}
        name="Summary"
        component={SummaryViewScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabBarIcon name="list-outline" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
    marginTop: 2,
  },
});

export default PdfStackNavigator;
