import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigator from './src/navigators/AppNavigator';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, useTheme} from './src/theme/ThemeContext';
import 'react-native-gesture-handler';

interface RouteNameContextType {
  currentRouteName: string | undefined;
  setCurrentRouteName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const RouteNameContext = React.createContext<
  RouteNameContextType | undefined
>(undefined);

const AppContent: React.FC = () => {
  const { theme, isDark } = useTheme();
  const [currentRouteName, setCurrentRouteName] = React.useState<
    string | undefined
  >(undefined);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.statusBar}
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
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
