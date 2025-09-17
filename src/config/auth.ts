// Authentication configuration
export const AUTH_CONFIG = {
  // Default password - change this in production
  PASSWORD: "data2024",
  
  // Session duration in milliseconds (24 hours)
  SESSION_DURATION: 10 * 60 * 1000,
  
  // Storage keys
  STORAGE_KEYS: {
    AUTHENTICATED: "dataHub_authenticated",
    AUTH_TIME: "dataHub_authTime",
  },
  
  // Password requirements (for future enhancement)
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 6,
    REQUIRE_UPPERCASE: false,
    REQUIRE_NUMBERS: false,
    REQUIRE_SPECIAL_CHARS: false,
  }
};

// You can override the password by setting an environment variable
// In production, set VITE_APP_PASSWORD in your environment
export const getPassword = (): string => {
  return import.meta.env.VITE_APP_PASSWORD || AUTH_CONFIG.PASSWORD;
};
