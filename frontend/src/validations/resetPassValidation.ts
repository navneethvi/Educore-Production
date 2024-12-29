export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};
