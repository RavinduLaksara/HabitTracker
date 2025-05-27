'use client';

import type React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {AuthNavigator} from './AuthNavigator';
import {TabNavigator} from './TabNavigator';
import {LoadingSpinner} from '../components/common/LoadingSpinner';
import {CreateHabitScreen} from '../screens/habits/CreateHabitScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const {user, isLoading} = useAuth();
  const {colors} = useTheme();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="CreateHabit"
              component={CreateHabitScreen}
              options={{
                headerShown: true,
                title: 'Create New Habit',
                headerStyle: {
                  backgroundColor: colors.surface,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
