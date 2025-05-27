'use client';

import type React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../styles/colors';

interface ProgressChartProps {
  title: string;
  percentage: number;
  subtitle?: string;
  weeklyData?: number[];
}

const {width} = Dimensions.get('window');

export const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  percentage,
  subtitle,
  weeklyData,
}) => {
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return colors.success;
    if (percent >= 60) return colors.primary;
    if (percent >= 40) return colors.warning;
    return colors.error;
  };

  const renderWeeklyChart = () => {
    if (!weeklyData) return null;

    const maxHeight = 50;
    const barWidth = (width - 120) / 7;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Last 7 Days</Text>
        <View style={styles.chart}>
          {weeklyData.map((value, index) => (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max((value / 100) * maxHeight, 4),
                    backgroundColor: getProgressColor(value),
                    width: barWidth - 4,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{value}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: getProgressColor(percentage),
              },
            ]}
          />
        </View>
        <Text
          style={[styles.percentage, {color: getProgressColor(percentage)}]}>
          {percentage}%
        </Text>
      </View>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {renderWeeklyChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 70,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    borderRadius: 3,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
