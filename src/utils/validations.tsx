import { isValidPhoneNumber } from 'libphonenumber-js';

interface ValidationParams {
  name?: string;
  email?: string;
  phone?: string;
  password: string;
  cPassword?: string;
  newPassword?: string;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    password: string;
    cPassword?: string;
    newPassword?: string;
  };
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateSignupFields = (state: ValidationParams) => {
  const errors = {
    name: '',
    email: '',
    phone: '',
    password: '',
    cPassword: '',
  };

  if (!state.name) {
    errors.name = 'Please enter your name';
  }

  if (!state.email) {
    errors.email = 'Please enter your email address';
  } else if (!emailRegex.test(state.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!state.phone) {
    errors.phone = 'Please enter your phone number';
  } else if (!isValidPhoneNumber(state.phone, 'US')) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!state.password) {
    errors.password = 'Please enter your password';
  } else if (state.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!state.cPassword) {
    errors.cPassword = 'Please enter your confirm password';
  } else if (state.password !== state.cPassword) {
    errors.cPassword = 'Passwords do not match';
  }
  return errors;
};

export const validateLoginFields = (state: ValidationParams) => {
  const errors = {
    email: '',
    password: '',
  };

  if (!state.email) {
    errors.email = 'Please enter your email address';
  } else if (!emailRegex.test(state.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!state.password) {
    errors.password = 'Please enter your password';
  }

  return errors;
};

export const forgotValidation = (email: string) => {
  let emailError = '';

  if (!email) {
    emailError = 'Please enter your email address';
  } else if (!emailRegex.test(email)) {
    emailError = 'Please enter a valid email address';
  }
  return emailError;
};

export const passwordValidation = (state: ValidationParams, type: string) => {
  const errors = {
    password: '',
    cPassword: '',
    newPassword: '',
  };

  if (!state.newPassword) {
    errors.newPassword = 'Please enter your new password';
  } else if (state.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters';
  }

  if (type !== 'reset') {
    if (!state.password) {
      errors.password = 'Please enter your password';
    }
  }

  if (!state.cPassword) {
    errors.cPassword = 'Please enter your confirm password';
  } else if (state.newPassword !== state.cPassword) {
    errors.cPassword = 'Passwords do not match';
  }

  return errors;
};
