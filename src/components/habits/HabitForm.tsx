'use client';

import type React from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Input} from '../common/Input';
import {Button} from '../common/Button';
import {useAuth} from '../../context/AuthContext';
import {HabitService} from '../../services/HabitService';
import {colors} from '../../styles/colors';
import {validateHabitName} from '../../utils/validationUtils';

interface HabitFormProps {
  onSuccess: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({onSuccess}) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{habitName?: string}>({});
  const {user} = useAuth();

  const handleSubmit = async () => {
    // Validate input
    const nameValidation = validateHabitName(habitName);
    if (!nameValidation.isValid) {
      setErrors({habitName: nameValidation.message});
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const habitService = HabitService.getInstance();
      await habitService.createHabit(habitName.trim(), frequency, user.id);

      Alert.alert('Success! 🎉', 'Your new habit has been created', [
        {
          text: 'OK',
          onPress: () => {
            setHabitName('');
            setFrequency('daily');
            onSuccess();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Habit</Text>

      <Input
        label="Habit Name"
        value={habitName}
        onChangeText={text => {
          setHabitName(text);
          if (errors.habitName) {
            setErrors({...errors, habitName: undefined});
          }
        }}
        placeholder="e.g., Exercise, Read, Drink Water"
        error={errors.habitName}
        containerStyle={styles.inputContainer}
      />

      <View style={styles.frequencyContainer}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyButtons}>
          <Button
            title="Daily"
            onPress={() => setFrequency('daily')}
            variant={frequency === 'daily' ? 'primary' : 'outline'}
            style={styles.frequencyButton}
            size="medium"
          />
          <Button
            title="Weekly"
            onPress={() => setFrequency('weekly')}
            variant={frequency === 'weekly' ? 'primary' : 'outline'}
            style={styles.frequencyButton}
            size="medium"
          />
        </View>
      </View>

      <Button
        title="Create Habit"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
        size="large"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 20,
    margin: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
  },
});
