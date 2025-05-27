'use client';

import type React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {HabitForm} from '../../components/habits/HabitForm';

interface CreateHabitScreenProps {
  navigation: any;
}

export const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({
  navigation,
}) => {
  const {colors} = useTheme();

  const handleSuccess = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={[styles.title, {color: colors.text}]}>
            Create New Habit ✨
          </Text>
          <HabitForm onSuccess={handleSuccess} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});
