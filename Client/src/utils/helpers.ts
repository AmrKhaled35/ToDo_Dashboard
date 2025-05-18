import { Todo, Category, Priority } from '../types';
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 0) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
};
export const calculateStats = (todos: Todo[]) => {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const categoryCounts = todos.reduce((acc: Record<Category, number>, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const priorityCounts = todos.reduce((acc: Record<Priority, number>, todo) => {
    acc[todo.priority] = (acc[todo.priority] || 0) + 1;
    return acc;
  }, {} as Record<Priority, number>);

  const dueToday = todos.filter((todo) => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const overdue = todos.filter((todo) => {
    if (!todo.dueDate || todo.completed) return false;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length;

  return {
    total,
    completed,
    pending,
    completionRate,
    categoryCounts,
    priorityCounts,
    dueToday,
    overdue,
  };
};
export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100 border-red-200';
    case 'medium':
      return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'low':
      return 'text-green-600 bg-green-100 border-green-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};
export const getCategoryColor = (category: Category): string => {
  switch (category) {
    case 'work':
      return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'personal':
      return 'text-purple-600 bg-purple-100 border-purple-200';
    case 'shopping':
      return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    case 'health':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'finance':
      return 'text-amber-600 bg-amber-100 border-amber-200';
    case 'other':
      return 'text-gray-600 bg-gray-100 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};
export const groupTodosByDate = (todos: Todo[]) => {
  const grouped: Record<string, Todo[]> = {};
  
  todos.forEach((todo) => {
    if (!todo.due_date) return;
    
    const dateKey = todo.due_date.split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(todo);
  });
  
  return grouped;
};