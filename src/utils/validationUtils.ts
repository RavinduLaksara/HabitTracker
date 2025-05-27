export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): {isValid: boolean; message?: string} => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }
  return {isValid: true};
};

export const validateName = (
  name: string,
): {isValid: boolean; message?: string} => {
  if (name.trim().length < 2) {
    return {isValid: false, message: 'Name must be at least 2 characters long'};
  }
  return {isValid: true};
};

export const validateHabitName = (
  name: string,
): {isValid: boolean; message?: string} => {
  if (name.trim().length === 0) {
    return {isValid: false, message: 'Habit name is required'};
  }
  if (name.trim().length > 50) {
    return {
      isValid: false,
      message: 'Habit name must be less than 50 characters',
    };
  }
  return {isValid: true};
};
