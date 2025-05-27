'use client';

import type React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '../context/ThemeContext';
import {HabitListScreen} from '../screens/habits/HabitListScreen';
import {CreateHabitScreen} from '../screens/habits/CreateHabitScreen';
import {ProgressScreen} from '../screens/habits/ProgressScreen';
import {SettingsScreen} from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HabitStack: React.FC = () => {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="HabitList"
        component={HabitListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateHabit"
        component={CreateHabitScreen}
        options={{
          title: 'Create New Habit',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

const TabIcon: React.FC<{icon: string; color: string}> = ({icon, color}) => (
  <Text style={{fontSize: 20, color}}>{icon}</Text>
);

export const TabNavigator: React.FC = () => {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="Habits"
        component={HabitStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <TabIcon icon="📝" color={color} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <TabIcon icon="📊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <TabIcon icon="⚙️" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
