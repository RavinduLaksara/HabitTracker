'use client';

import type React from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useHabits} from '../../context/HabitContext';
import {getDaysInMonth, getMonthName, getWeekDays} from '../../utils/dateUtils';

export const CalendarView: React.FC = () => {
  const {colors} = useTheme();
  const {habits, completions} = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const getCompletionsForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day,
    ).padStart(2, '0')}`;
    return completions.filter(completion => completion.date === dateString);
  };

  const getProgressColor = (completionPercentage: number) => {
    if (completionPercentage >= 80) return colors.success;
    if (completionPercentage >= 60) return colors.primary;
    if (completionPercentage >= 40) return colors.info;
    if (completionPercentage >= 20) return colors.warning;
    if (completionPercentage > 0) return colors.error;
    return colors.border;
  };

  const renderCalendarDay = (day: number) => {
    const dayCompletions = getCompletionsForDate(day);
    const completionCount = dayCompletions.length;
    const totalHabits = habits.length;
    const completionPercentage =
      totalHabits > 0 ? (completionCount / totalHabits) * 100 : 0;

    const dayColor = getProgressColor(completionPercentage);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayContainer,
          {
            backgroundColor: dayColor,
            borderColor: isToday ? colors.text : 'transparent',
            borderWidth: isToday ? 3 : 1,
          },
        ]}>
        <Text
          style={[
            styles.dayText,
            {color: completionPercentage > 0 ? '#FFFFFF' : colors.text},
          ]}>
          {day}
        </Text>
        {completionCount > 0 && (
          <View
            style={[styles.completionBadge, {backgroundColor: colors.text}]}>
            <Text style={styles.completionText}>{completionCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyDay = (index: number) => (
    <View key={`empty-${index}`} style={styles.emptyDay} />
  );

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View
        style={[styles.calendarContainer, {backgroundColor: colors.surface}]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigateMonth('prev')}
            style={styles.navButton}>
            <Text style={[styles.navButtonText, {color: colors.primary}]}>
              ‹
            </Text>
          </TouchableOpacity>
          <Text style={[styles.monthYear, {color: colors.text}]}>
            {getMonthName(month)} {year}
          </Text>
          <TouchableOpacity
            onPress={() => navigateMonth('next')}
            style={styles.navButton}>
            <Text style={[styles.navButtonText, {color: colors.primary}]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Week days */}
        <View style={styles.weekDaysContainer}>
          {getWeekDays().map(day => (
            <Text
              key={day}
              style={[styles.weekDay, {color: colors.textSecondary}]}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {/* Empty cells for days before the first day of the month */}
          {Array.from({length: firstDayOfMonth}, (_, index) =>
            renderEmptyDay(index),
          )}

          {/* Days of the month */}
          {Array.from({length: daysInMonth}, (_, index) =>
            renderCalendarDay(index + 1),
          )}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={[styles.legendTitle, {color: colors.text}]}>
            Progress Legend:
          </Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: colors.border}]}
              />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>
                No habits
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: colors.error}]}
              />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>
                1-20%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: colors.warning}]}
              />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>
                20-40%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: colors.info}]}
              />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>
                40-60%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: colors.primary}]}
              />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>
                60-80%
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: colors.success}]}
              />
              <Text style={[styles.legendText, {color: colors.textSecondary}]}>
                80-100%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    margin: 16,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  navButton: {
    padding: 10,
    borderRadius: 20,
  },
  navButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    width: 40,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    position: 'relative',
  },
  emptyDay: {
    width: 40,
    height: 40,
    margin: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  completionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 25,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
