export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const isToday = (dateString: string): boolean => {
  return dateString === getTodayString();
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (month: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
};

export const getWeekDays = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const calculateProgress = (habits: any[], date: string): number => {
  if (habits.length === 0) return 0;
  const completedToday = habits.filter(habit =>
    habit.completedDates.includes(date),
  ).length;
  return Math.round((completedToday / habits.length) * 100);
};

export const getWeeklyProgress = (habits: any[]): number[] => {
  const weekProgress = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);
    const progress = calculateProgress(habits, dateString);
    weekProgress.push(progress);
  }

  return weekProgress;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getStreakCount = (habit: any): number => {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateString = formatDate(checkDate);

    if (habit.completedDates.includes(dateString)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
