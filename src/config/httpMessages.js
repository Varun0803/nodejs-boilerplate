const authMessage = {
  // General Authentication Messages
  UNAUTHORIZED: 'Unauthorized: Please authenticate',
  SESSION_EXPIRED: 'Session has expired. Please log in again',
  FORBIDDEN: 'Forbidden: You do not have permission to access this resource',
  INVALID_TOKEN: 'Invalid Token',

  // User and Admin Management
  USER_NOT_ACTIVE: 'User is not active',
  NOT_FOUND: 'User not found',
  USER_IS_DISABLED: 'User is disabled',
  EMAIL_ALREADY_REGISTERED: 'Email is already registered',
  PHONE_NUMBER_ALREADY_REGISTERED: 'Phone number is already registered',
  USER_ALREADY_EXIST: 'User already exists',
  USER_CREATED_SUCCESSFULLY: 'User created successfully',
  USER_UPDATED_SUCCESSFULLY: 'User updated successfully',
  USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
  USER_LOGGED_IN_SUCCESSFULLY: 'Logged in successfully',
  USER_LOGGED_OUT_SUCCESSFULLY: 'Logout successfully',
  USER_REQUIRED: 'User is required',
  USER_DEACTIVATED: 'Something went wrong, please contact administrator',

  CANNOT_CHANGE_OWN_ROLE: 'You cannot change your own role',
  CANNOT_EDIT_ADMIN: 'You cannot edit admin',
  CANNOT_ASSIGN_ADMIN_ROLE: 'You cannot assign admin role',
  CANNOT_CHANGE_ROLE: 'You cannot change role',
  CANNOT_EDIT_NON_USER: 'You cannot edit non-user',
  // Admin-Specific Messages
  ADMIN_LOGIN_REQUIRED: 'Admin access is required for this action',
  ADMIN_NOT_AUTHORIZED: 'You are not authorized as an admin',

  // Email and Password Authentication
  EMPTY_EMAIL: 'Email cannot be empty',
  EMAIL_VERIFICATION_FAILED: 'Email verification failed',
  EMAIL_VERIFICATION_SUCCESS: 'Email verified successfully',
  RESET_PASSWORD_FAILED: 'Invalid link/Link expired ',
  INVALID_CREDENTIALS: 'Invalid email or password',
  VERIFICATION_EMAIL_SENT_SUCCESSFULLY: 'Verification email sent successfully',
  INVALID_PHONE_NUMBER: 'Invalid phone number',

  // Miscellaneous
  TOKEN_REFRESHED_SUCCESSFULLY: 'Token refreshed successfully',
  ACCOUNT_CREATED_SUCCESSFULLY: 'Account created successfully',
  PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully',
  PASSWORD_RESET_SUCCESSFULLY: 'Password reset successfully',
  PASSWORD_RESET_SENT_SUCCESSFULLY: 'Password reset email sent successfully',
  USER_FOUND: 'User found',
};

const genericMessage = {
  SOMETHING_WENT_WRONG: 'Something went wrong',
  UNAVAILABLE: 'Service is unavailable at the moment',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later.',
  NOT_FOUND: 'Not found',
};

const otpMessage = {
  OTP_BLOCKED:
    'You have reached the maximum number of attempts. Please try again later.',
  OTP_NOT_FOUND: 'OTP not found',
  OTP_EXPIRED: 'OTP has expired. Please try again',
  OTP_SENT_SUCCESSFULLY: 'OTP sent successfully',
  MAX_OTP_ATTEMPTS:
    'You have reached the maximum number of attempts. Please try again later.',
  MAX_OTP_RESENDS:
    'You have reached the maximum number of resends. Please try again later.',
  OTP_RESEND_SUCCESS: 'OTP resend successfully',
  UNAVAILABLE: 'Service is unavailable at the moment',
  INCORRECT_OTP: 'Incorrect OTP',
};

const userCrudMessage = {
  ADMIN_CREATION_ERROR: 'Email and password are required for admin creation',
  PHONE_NUMBER_REQUIRED: 'Phone number is required for creation of this role',
};

module.exports = {
  authMessage,
  genericMessage,
  otpMessage,
  userCrudMessage,
};
