import type React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import {HabitProvider} from './src/context/HabitContext';
import {AppNavigator} from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitProvider>
          <StatusBar barStyle="dark-content" />
          <AppNavigator />
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
