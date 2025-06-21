import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigators/AppNavigator';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

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
        <RouteNameContext.Provider
          value={{currentRouteName, setCurrentRouteName}}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </RouteNameContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
