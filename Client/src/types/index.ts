export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Finance' | 'Other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
  category: Category;
  tags: string[];
  userId: string;
}
export interface AppState {
  isLoading: boolean;
  error: string | null;
}
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    showCompletedTasks: boolean;
    defaultView: 'list' | 'calendar' | 'kanban';
    defaultCategory: Category;
    defaultPriority: Priority;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}