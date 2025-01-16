import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigators/AppNavigator';
import {StatusBar, StyleSheet} from 'react-native'; // Import StatusBar from React Native
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'; // Import SafeArea components

// import "react-native-devsettings/withAsyncStorage";
import 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

interface RouteNameContextType {
  currentRouteName: string | undefined;
  setCurrentRouteName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Define and export the context
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
        <LinearGradient colors={['#FFFFFF', '#F0F0F3']} style={styles.safeArea}>
          <SafeAreaView style={styles.safeArea}>
            <RouteNameContext.Provider
              value={{currentRouteName, setCurrentRouteName}}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </RouteNameContext.Provider>
          </SafeAreaView>
        </LinearGradient>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
