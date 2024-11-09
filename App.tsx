import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigators/AppNavigator';

interface RouteNameContextType {
  currentRouteName: string | undefined;
  setCurrentRouteName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

// Define and export the context
export const RouteNameContext = React.createContext<RouteNameContextType | undefined>(undefined);

export default function App() {
  const [currentRouteName, setCurrentRouteName] = React.useState<string | undefined>(undefined);

  return (
    <PaperProvider>
      <RouteNameContext.Provider value={{ currentRouteName, setCurrentRouteName }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RouteNameContext.Provider>
    </PaperProvider>
  );
}
