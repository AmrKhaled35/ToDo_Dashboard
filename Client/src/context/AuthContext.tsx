import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { generateId } from '../utils/helpers';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);

      if (user) {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const signup = (name: string, email: string, password: string) => {
    try {
      const validation = userSchema.parse({ name, email, password });
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((u: User) => u.email === email)) {
        toast.error('Email already exists');
        return;
      }

      const newUser: User = {
        id: generateId(),
        name,
        email,
        password,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        preferences: {
          theme: 'system',
          showCompletedTasks: true,
          defaultView: 'list',
          defaultCategory: 'personal',
          defaultPriority: 'medium',
        },
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error('Signup failed');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) =>
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};