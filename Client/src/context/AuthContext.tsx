import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

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

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://omarawadsaber.pythonanywhere.com/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email , password }), 
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
          defaultCategory: 'personal',
          defaultPriority: 'medium',
        },
      };

      setUser(currentUser);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      toast.success('Login successful!');
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Login failed. Please check your email and password.');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://omarawadsaber.pythonanywhere.com/api/users/register/', {
        method: 'POST',
        headers: {
          Authorization: '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email : email,
          password : password,
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
