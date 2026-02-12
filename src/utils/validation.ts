export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }

  if (email.length > 60) {
    return 'Email must not exceed 60 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};


export const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  return /^\d{10}$/.test(phone);
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  const hasAlpha = /[a-zA-Z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);

  if (!hasAlpha || !hasNumeric) {
    return 'Password must contain both letters and numbers';
  }

  return null;
};

export const validatePasswordResetEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }

  if (email.length > 60) {
    return 'Email must not exceed 60 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};
