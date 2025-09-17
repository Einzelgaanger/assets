import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AUTH_CONFIG } from "@/config/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authStatus = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED);
      const authTime = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME);
      
      if (authStatus === "true" && authTime) {
        // Check if session is still valid
        const sessionAge = Date.now() - parseInt(authTime);
        
        if (sessionAge < AUTH_CONFIG.SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear storage
          localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED);
          localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
