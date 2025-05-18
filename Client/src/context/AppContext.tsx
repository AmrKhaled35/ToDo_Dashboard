import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Todo, User, Category, Priority, AppState } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface AppContextType {
  todos: Todo[];
  user: User;
  appState: AppState;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<void>;
  updateTodo: (id: string, todo: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  filterTodos: (filters: {
    search?: string;
    category?: Category;
    priority?: Priority;
    completed?: boolean;
    tags?: string[];
  }) => Todo[];
  refreshTodos: () => Promise<void>;
}

const API_URL = 'https://omarawadsaber.pythonanywhere.com/api/tasks';

const defaultUser: User = {
  id: '1',
  name: 'Amr',
  email: 'user@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  preferences: {
    theme: 'system',
    showCompletedTasks: true,
    defaultView: 'list',
    defaultCategory: 'Personal',
    defaultPriority: 'medium',
  },
  password: ''
};

const defaultAppState: AppState = {
  isLoading: false,
  error: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useLocalStorage<User>('user', defaultUser);
  const [appState, setAppState] = useState<AppState>(defaultAppState);

  const setLoading = (isLoading: boolean) => {
    setAppState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setAppState(prev => ({ ...prev, error }));
  };

  const getToken = () => localStorage.getItem('accessToken');

  const refreshTodos = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      console.log(token);
      if (!token) throw new Error('No access token found');

      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const processedData = data.map((todo: Todo) => ({
        ...todo,
        tags: todo.tags || []
      }));
      setTodos(processedData);
      setError(null);
    } catch (error) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No access token found');
      let formattedDueDate = null;
      if (todo.dueDate) {
        try {
          const date = new Date(todo.dueDate);
          if (!isNaN(date.getTime())) {
            formattedDueDate = date.toISOString();
          }
        } catch (e) {
          console.error('Invalid date format:', e);
        }
      }
      const body = {
        title: todo.title,
        description: todo.description || '',
        due_date: formattedDueDate,
        priority: todo.priority.toLowerCase(),
        category: capitalizeFirstLetter(todo.category),
        Tags: Array.isArray(todo.tags) ? todo.tags.join(' ') : ''
      };

      const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend response error:', errorData);
        throw new Error(`Error: ${response.status}`);
      }
      const newTodo = await response.json();
      const processedTodo = {
        ...newTodo,
        tags: newTodo.tags || []
      };
      setTodos(prev => [...prev, processedTodo]);
      setError(null);
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  const updateTodo = async (id: string, updatedFields: Partial<Todo>) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No access token found');
  
      let formattedDueDate = null;
      if (updatedFields.dueDate) {
        try {
          const date = new Date(updatedFields.dueDate);
          if (!isNaN(date.getTime())) {
            formattedDueDate = date.toISOString();
          }
        } catch (e) {
          console.error('Invalid date format:', e);
        }
      }
  
      const body = {
        ...(updatedFields.title !== undefined && { title: updatedFields.title }),
        ...(updatedFields.description !== undefined && { description: updatedFields.description }),
        ...(updatedFields.completed !== undefined && { completed: updatedFields.completed }),
        ...(updatedFields.priority !== undefined && { priority: updatedFields.priority.toLowerCase() }),
        ...(updatedFields.category !== undefined && { category: capitalizeFirstLetter(updatedFields.category) }),
        ...(updatedFields.tags !== undefined && { Tags: updatedFields.tags.join(' ') }),
        ...(formattedDueDate !== null && { due_date: formattedDueDate }),
      };
  
      const response = await fetch(`${API_URL}/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend response error:', errorData);
        throw new Error(`Error: ${response.status}`);
      }
  
      const updatedTodo = await response.json();
      const processedTodo = {
        ...updatedTodo,
        tags: updatedTodo.tags || []
      };
  
      setTodos(prev => prev.map(todo => todo.id === id ? processedTodo : todo));
      setError(null);
    } catch (error) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTodo = async (id: string) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${API_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
      setError(null);
    } catch (error) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No access token found');

      const response = await fetch(`${API_URL}/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedTodo = await response.json();
      // Ensure the updated todo has a tags array
      const processedTodo = {
        ...updatedTodo,
        tags: updatedTodo.tags || []
      };
      setTodos(prev => prev.map(t => t.id === id ? processedTodo : t));
      setError(null);
    } catch (error) {
      setError('Failed to update task status. Please try again.');
      console.error('Error toggling todo completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  const filterTodos = (filters: {
    search?: string;
    category?: Category;
    priority?: Priority;
    completed?: boolean;
    tags?: string[];
  }) => {
    return todos.filter(todo => {
      if (
        filters.search &&
        !todo.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !todo.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.category && todo.category !== filters.category) {
        return false;
      }
      if (filters.priority && todo.priority !== filters.priority) {
        return false;
      }
      if (filters.completed !== undefined && todo.completed !== filters.completed) {
        return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => todo.tags.includes(tag))) {
          return false;
        }
      }
      return true;
    });
  };

  return (
    <AppContext.Provider
      value={{
        todos,
        user,
        appState,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        updateUser,
        filterTodos,
        refreshTodos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};