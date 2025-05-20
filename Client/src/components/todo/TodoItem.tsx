import React, { useState } from 'react';
import { CheckCircle, Circle, Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Todo } from '../../types';
import { formatDate, getPriorityColor, getCategoryColor } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Tin from '../../sounds/Tin.wav'

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleComplete, deleteTodo } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = new Audio(Tin); 
    audio.play();
    toggleComplete(todo.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTodo(todo.id);
  };

  const priorityClass = getPriorityColor(todo.priority);
  const categoryClass = getCategoryColor(todo.category);

  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
        isHovered ? 'shadow-md' : ''
      } ${todo.completed ? 'opacity-70 dark:opacity-60' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(todo)}
    >
      <div className="flex items-start">
        <button
          className="mt-1 mr-3 text-gray-400 hover:text-indigo-600 transition-colors dark:text-gray-500 dark:hover:text-indigo-400"
          onClick={handleToggle}
        >
          {todo.isCompleted ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <Circle size={20} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3
              className={`text-base font-medium break-words ${
                todo.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
              }`}
            >
              {todo.title}
            </h3>
            <div className="flex space-x-2 ml-2">
              <button
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors dark:text-gray-500 dark:hover:text-indigo-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(todo);
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="p-1 text-gray-400 hover:text-red-600 transition-colors dark:text-gray-500 dark:hover:text-red-500"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {todo.description && (
            <p
              className={`mt-1 text-sm ${
                todo.isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`${priorityClass} dark:border-gray-600 dark:text-gray-300`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </Badge>

            <Badge variant="outline" className={`${categoryClass} dark:border-gray-600 dark:text-gray-300`}>
              <Tag size={12} className="mr-1" />
              {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
            </Badge>

            {todo.due_date && (
              <Badge variant="outline" className="text-gray-600 bg-gray-50 dark:text-gray-300 dark:bg-gray-700">
                <Calendar size={12} className="mr-1" />
                {formatDate(todo.due_date)}
              </Badge>
            )}
          </div>

          {todo.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {todo.tags.map((tag) => (
                <Badge key={tag} variant="primary" className="text-xs dark:bg-gray-600 dark:text-white">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
