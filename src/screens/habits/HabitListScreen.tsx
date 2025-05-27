'use client';

import type React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {HabitCard} from '../../components/habits/HabitCard';
import {Button} from '../../components/common/Button';
import {useAuth} from '../../context/AuthContext';
import {HabitService} from '../../services/HabitService';
import type {Habit} from '../../types';
import {colors} from '../../styles/colors';
import {
  getTodayString,
  calculateProgress,
  getGreeting,
} from '../../utils/dateUtils';

interface HabitListScreenProps {
  navigation: any;
}

type FilterType = 'all' | 'today' | 'completed';

export const HabitListScreen: React.FC<HabitListScreenProps> = ({
  navigation,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const {user, logout} = useAuth();

  const today = getTodayString();

  const loadHabits = useCallback(async () => {
    try {
      const loadedHabits = await HabitService.getInstance().getAllHabits();
      setHabits(loadedHabits);
    } catch (error) {
      Alert.alert('Error', 'Failed to load habits');
    }
  }, []);

  const applyFilter = useCallback(() => {
    let filtered = [...habits];

    switch (filter) {
      case 'today':
        filtered = habits.filter(habit => habit.frequency === 'daily');
        break;
      case 'completed':
        filtered = habits.filter(habit => habit.completedDates.includes(today));
        break;
      default:
        break;
    }

    setFilteredHabits(filtered);
  }, [habits, filter, today]);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await HabitService.getInstance().toggleHabitCompletion(habitId, today);
      await loadHabits();
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await HabitService.getInstance().deleteHabit(habitId);
            await loadHabits();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete habit');
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const renderFilterButton = (
    filterType: FilterType,
    title: string,
    icon: string,
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor:
            filter === filterType ? colors.primary : colors.background,
          borderColor: filter === filterType ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setFilter(filterType)}>
      <Text style={styles.filterIcon}>{icon}</Text>
      <Text
        style={[
          styles.filterButtonText,
          {
            color: filter === filterType ? colors.surface : colors.text,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderHabitItem = ({item}: {item: Habit}) => (
    <HabitCard
      habit={item}
      onToggleComplete={handleToggleHabit}
      onDelete={handleDeleteHabit}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{filter === 'all' ? '🌱' : '🔍'}</Text>
      <Text style={styles.emptyTitle}>
        {filter === 'all' ? 'No habits yet!' : 'No habits found'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all'
          ? 'Start building good habits today'
          : 'Try changing your filter or create new habits'}
      </Text>
      {filter === 'all' && (
        <Button
          title="Create Your First Habit"
          onPress={() => navigation.navigate('CreateHabit')}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  const todayProgress = calculateProgress(habits, today);
  const completedToday = habits.filter(h =>
    h.completedDates.includes(today),
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
            </Text>
            <Text style={styles.headerTitle}>My Habits</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressSummary}>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{completedToday}</Text>
            <Text style={styles.progressLabel}>Completed</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{habits.length}</Text>
            <Text style={styles.progressLabel}>Total</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={[styles.progressNumber, {color: colors.primary}]}>
              {todayProgress}%
            </Text>
            <Text style={styles.progressLabel}>Progress</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {renderFilterButton('all', 'All', '📋')}
          {renderFilterButton('today', 'Today', '🌅')}
          {renderFilterButton('completed', 'Done', '✅')}
        </View>
      </View>

      {/* Habits List */}
      <FlatList
        data={filteredHabits}
        renderItem={renderHabitItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="+ Add New Habit"
          onPress={() => navigation.navigate('CreateHabit')}
          style={styles.addButton}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  logoutIcon: {
    fontSize: 20,
  },
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  addButtonContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  addButton: {
    marginBottom: 8,
  },
});
