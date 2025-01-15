import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import PDFViewScreen from '../screens/PDFViewScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SummaryViewScreen from '../screens/SummaryViewScreen';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({name, focused, color}) => (
  <View style={styles.iconContainer}>
    <Icon name={name} size={24} color={color} />
    {focused && <View style={styles.dot} />}
  </View>
);

const TabNavigator = props => {
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
});

export default TabNavigator;
