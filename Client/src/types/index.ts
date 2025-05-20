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

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  tasks: Todo[];
  color: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}