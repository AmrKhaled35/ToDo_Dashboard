import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import toast from 'react-hot-toast';
import WelcomeSound from '../sounds/Welcome2.mp3'


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearAppData = () => {
    window.dispatchEvent(new Event('authStateChanged'));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('Token');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setUser(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      const response = await fetch('https://omarawadsaber.pythonanywhere.com/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('Login Response:', data);

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      const currentUser: User = {
        id: 'server',
        name: email.split('@')[0],
        email,
        password: '',
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        preferences: {
          theme: 'system',
          showCompletedTasks: true,
          defaultView: 'list',
          defaultCategory: 'Personal',
          defaultPriority: 'medium',
        },
      };

      setUser(currentUser);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      clearAppData();

      toast.success('Login successful!');
      navigate('/');
      const audio = new Audio(WelcomeSound);
      audio.play().catch(err => console.warn("Autoplay blocked:", err));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Login failed. Please check your email and password.');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('https://omarawadsaber.pythonanywhere.com/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
          password2: password,
        }),
      });

      const data = await response.json();
      console.log('Signup Response:', data);
      if (!response.ok) {
        const errorMessage =
          data?.email?.[0] ||
          data?.username?.[0] ||
          data?.password?.[0] ||
          data?.password2?.[0] ||
          data?.phone_number?.[0] ||
          'Signup failed';
        toast.error(errorMessage);
        return;
      }

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear app data and notify components
    clearAppData();

    toast.success('Logged out successfully');
    navigate('/login');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
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