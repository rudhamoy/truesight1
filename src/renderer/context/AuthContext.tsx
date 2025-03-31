import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = {
  'admin': { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
  'user': { username: 'user', password: 'user123', name: 'Regular User', role: 'user' },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('truesight_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('truesight_user');
      }
    }
  }, []);

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      // Save the current location to redirect back after login
      const currentPath = location.pathname + location.search + location.hash;
      if (currentPath !== '/') {
        localStorage.setItem('truesight_redirect', currentPath);
      }
      navigate('/login');
    }
  }, [user, location, navigate]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[username as keyof typeof MOCK_USERS];
    
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      
      // Store user in localStorage for persistence
      localStorage.setItem('truesight_user', JSON.stringify(userWithoutPassword));
      
      // Redirect to saved location or default to overview
      const redirectPath = localStorage.getItem('truesight_redirect') || '/overview';
      localStorage.removeItem('truesight_redirect');
      navigate(redirectPath);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('truesight_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
