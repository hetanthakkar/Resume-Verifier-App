import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LandingScreen from '../screens/LandingScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import HomeTabNavigator from './HomeTabNavigator';

const Stack = createNativeStackNavigator();

const BackButton = ({ navigation }) => (
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="chevron-back" size={28} color="#0056B3" />
  </TouchableOpacity>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={({ navigation }) => ({
        headerShown: false,
        // headerLeft: () => <BackButton navigation={navigation} />,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitleStyle: {
          color: '#1C1C1E',
          fontSize: 17,
          fontWeight: '600',
        },
      })}
    >
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen}
      />

      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
        }}
      />

      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
        }}
      />

      <Stack.Screen 
        name="ForgetPassword" 
        component={ForgetPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="Home"
        component={HomeTabNavigator}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AppNavigator;