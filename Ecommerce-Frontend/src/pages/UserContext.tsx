import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  userId:   string;
  name:     string;
  email:    string;
  role:     string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // 1. Initialize from localStorage, if any
  const stored = localStorage.getItem('DBD_USER');
  const [user, setUser] = useState<User | null>(
    stored ? JSON.parse(stored) : null
  );

  // 2. login() sets state *and* localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('DBD_USER', JSON.stringify(userData));
  };

  // 3. logout() clears both
  const logout = () => {
    setUser(null);
    localStorage.removeItem('DBD_USER');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
