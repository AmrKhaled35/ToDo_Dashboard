import React from 'react';
import { useApp } from '../context/AppContext';
import { Category, Todo } from '../types';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import TodoItem from '../components/todo/TodoItem';
import TodoModal from '../components/todo/TodoModal';
import { Tag } from 'lucide-react';

const Categories: React.FC = () => {
  const { todos, updateTodo } = useApp();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTodo, setCurrentTodo] = React.useState<Todo | undefined>(undefined);

  const categories: Category[] = ['work', 'personal', 'shopping', 'health', 'finance', 'other'];

  const getCategoryIcon = (category: Category) => {
    let color;
    switch (category) {
      case 'work':
        color = 'text-blue-600 bg-blue-100';
        break;
      case 'personal':
        color = 'text-purple-600 bg-purple-100';
        break;
      case 'shopping':
        color = 'text-emerald-600 bg-emerald-100';
        break;
      case 'health':
        color = 'text-green-600 bg-green-100';
        break;
      case 'finance':
        color = 'text-amber-600 bg-amber-100';
        break;
      default:
        color = 'text-gray-600 bg-gray-100';
    }

    return (
      <div className={`p-2 rounded-full ${color}`}>
        <Tag size={20} />
      </div>
    );
  };

  const getTodosByCategory = (category: Category): Todo[] => {
    return todos.filter((todo) => todo.category === category);
  };

  const handleEditTodo = (todo: Todo) => {
    setCurrentTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTodo(undefined);
  };

  const handleSubmit = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (currentTodo) {
      updateTodo(currentTodo.id, todoData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryTodos = getTodosByCategory(category);
          return (
            <Card key={category} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-semibold capitalize">{category}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {categoryTodos.length} tasks
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                {categoryTodos.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No tasks in this category
                  </p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {categoryTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onEdit={handleEditTodo}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        todo={currentTodo}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Categories;