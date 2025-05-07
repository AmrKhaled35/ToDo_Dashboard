import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo, User, Category, Priority } from '../types';
import { generateId } from '../utils/helpers';

interface AppContextType {
  todos: Todo[];
  user: User;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  filterTodos: (filters: {
    search?: string;
    category?: Category;
    priority?: Priority;
    completed?: boolean;
    tags?: string[];
  }) => Todo[];
}

const defaultUser: User = {
  id: '1',
  name: 'Amr',
  email: 'user@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  preferences: {
    theme: 'system',
    showCompletedTasks: true,
    defaultView: 'list',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    const storedUser = localStorage.getItem('user');

    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    } else {
      const sampleTodos = [
        {
          id: generateId(),
          title: 'Welcome to Task Master',
          description: 'This is your first task! Try completing it.',
          completed: false,
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          priority: 'medium' as Priority,
          category: 'personal' as Category,
          tags: ['welcome', 'getting-started'],
        },
        {
          id: generateId(),
          title: 'Create your first task',
          description: 'Click the + button to add a new task',
          completed: false,
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 172800000).toISOString(),
          priority: 'high' as Priority,
          category: 'work' as Category,
          tags: ['tutorial'],
        },
      ];
      setTodos(sampleTodos);
      localStorage.setItem('todos', JSON.stringify(sampleTodos));
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, updatedFields: Partial<Todo>) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updatedFields } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedFields }));
  };

  const filterTodos = (filters: {
    search?: string;
    category?: Category;
    priority?: Priority;
    completed?: boolean;
    tags?: string[];
  }) => {
    return todos.filter((todo) => {
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
        if (!filters.tags.some((tag) => todo.tags.includes(tag))) {
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
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        updateUser,
        filterTodos,
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