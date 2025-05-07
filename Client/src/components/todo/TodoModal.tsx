import React from 'react';
import { X } from 'lucide-react';
import { Todo } from '../../types';
import TodoForm from './TodoForm';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo;
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  todo,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-5 mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              {todo ? 'Edit Task' : 'Add New Task'}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <TodoForm
            todo={todo}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoModal;