import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigators/AppNavigator';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

interface RouteNameContextType {
  currentRouteName: string | undefined;
  setCurrentRouteName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const RouteNameContext = React.createContext<
  RouteNameContextType | undefined
>(undefined);

export default function App() {
  const [currentRouteName, setCurrentRouteName] = React.useState<
    string | undefined
  >(undefined);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <LinearGradient
          colors={['#FFFFFF', '#F0F0F3']}
          style={styles.container}>
          <RouteNameContext.Provider
            value={{currentRouteName, setCurrentRouteName}}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </RouteNameContext.Provider>
        </LinearGradient>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add these to ensure gradient fills the entire screen
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
