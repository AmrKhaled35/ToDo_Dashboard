import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  profilePhoto: string;
  isAdmin: boolean;
}

interface UserContextType {
  ser: User | null;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<{ success: boolean; data?: User; error?: Error }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [ser, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const token = localStorage.getItem('accessToken');

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://omarawadsaber.pythonanywhere.com/api/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to fetch user');
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      const res = await fetch('https://omarawadsaber.pythonanywhere.com/api/users/me/', {
        method: 'PUT',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: updatedData instanceof FormData ? updatedData : JSON.stringify(updatedData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error('Error updating user:', data.detail || data);
        throw new Error(data.detail || 'Failed to update user');
      }
  
      setUser(data);
      return { success: true, data };
    } catch (err) {
      console.error('Update user failed:', err);
      return { success: false, error: err as Error };
    }
  };
  

  useEffect(() => {
    if (token) fetchUser();
    else setLoading(false);
  }, [token]);

  return (
    <UserContext.Provider value={{ ser, loading, error, fetchUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
