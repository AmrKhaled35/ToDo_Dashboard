import React, { useState } from 'react';
import { CheckCircle, Circle, Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import { Todo } from '../../types';
import { formatDate, getPriorityColor, getCategoryColor } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import Badge from '../ui/Badge';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleComplete, deleteTodo } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 ${
        isHovered ? 'shadow-md' : ''
      } ${todo.completed ? 'opacity-70' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(todo)}
    >
      <div className="flex items-start">
        <button
          className="mt-1 mr-3 text-gray-400 hover:text-indigo-600 transition-colors"
          onClick={handleToggle}
        >
          {todo.completed ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <Circle size={20} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3
              className={`text-base font-medium break-words ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>
            <div className="flex space-x-2 ml-2">
              <button
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(todo);
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {todo.description && (
            <p
              className={`mt-1 text-sm ${
                todo.completed ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={priorityClass}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </Badge>

            <Badge variant="outline" className={categoryClass}>
              <Tag size={12} className="mr-1" />
              {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
            </Badge>

            {todo.dueDate && (
              <Badge variant="outline" className="text-gray-600 bg-gray-50">
                <Calendar size={12} className="mr-1" />
                {formatDate(todo.dueDate)}
              </Badge>
            )}
          </div>

          {todo.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {todo.tags.map((tag) => (
                <Badge key={tag} variant="primary" className="text-xs">
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