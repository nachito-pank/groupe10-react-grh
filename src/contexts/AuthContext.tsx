import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    service_id?: number;
  }) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);

      console.log('🔴 RÉPONSE API LOGIN :', response);
      const token = (response as any)?.token;
      const user = (response as any)?.user;

      if (!token || !user) {
        console.error('Login: réponse incomplète', response);
        throw new Error('Réponse de login incomplète');
      }

      // normalize role to be lowercase
      user.role = String(user.role || '').toLowerCase();

      setToken(token);
      setUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Utilisateur connecté:', user);
      console.log('isAdmin:', String(user?.role || '').toLowerCase() === 'admin');

      // Return the user to callers so they can inspect role immediately (avoids stale checks)
      return user as User;
    } catch (err) {
      console.error('Erreur lors du login:', err);
      throw err;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    service_id?: number;
  }) => {
    try {
      const response = await authApi.register(data);

      console.log('🔵 RÉPONSE API REGISTER :', response);
      const token = (response as any)?.token;
      const user = (response as any)?.user;

      if (!token || !user) {
        console.error('Register: réponse incomplète', response);
        throw new Error('Réponse de registration incomplète');
      }

      // normalize role to be lowercase
      user.role = String(user.role || '').toLowerCase();

      setToken(token);
      setUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Utilisateur enregistré:', user);

      return user as User;
    } catch (err) {
      console.error('Erreur lors du register:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}