import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import PDFViewScreen from '../screens/PDFViewScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SummaryViewScreen from '../screens/SummaryViewScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ name, focused, color }) => (
  <View style={styles.iconContainer}>
    <Icon name={name} size={24} color={color} />
    {focused && <View style={styles.dot} />}
  </View>
);




const TabNavigator = (props) => {
  const navigation = useNavigation();
  useEffect(() => {
  
    const hideAllTabBars = () => {
      const currentOptions = navigation.getParent()?.getState()?.routes;
      // const tabBarStyle = navigation.getParent()?.;
      let currentNav = navigation;
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: 'none',
        }
      });
     
    };
  
    hideAllTabBars();
  
    return () => {
      let currentNav = navigation;
      while (currentNav?.getParent()) {
        currentNav.getParent()?.setOptions({
          tabBarStyle: undefined
        });
        currentNav = currentNav.getParent();
      }
    };
  }, [navigation]);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: route.name === 'PdfView' ? { display: 'none' } : styles.tabBar,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="PDFView"
        component={PDFViewScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="document-text-outline" focused={focused} color={color} />
          ),
          tabBarLabel: 'PDF',
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="bar-chart-outline" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryViewScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="list-outline" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    // position: 'absolute',
    // bottom: 25,
    // left: 20,
    // right: 20,
    // elevation: 0,
    // borderRadius: 15,
    // height: 60,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: {
    //   width: 0,
    //   height: 10
    // },
  },
  // absolute: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  //   borderRadius: 15,
  // },
  // iconContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   top: 10,
  // },
  // dot: {
  //   width: 4,
  //   height: 4,
  //   borderRadius: 2,
  //   backgroundColor: '#007AFF',
  //   position: 'absolute',
  //   bottom: -8,
  // },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TabNavigator;