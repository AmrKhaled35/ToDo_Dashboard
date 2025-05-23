import React from 'react';
import { useApp } from '../context/AppContext';
import { Category, Todo } from '../types';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import TodoItem from '../components/todo/TodoItem';
import TodoModal from '../components/todo/TodoModal';
import { Tag, Speaker } from 'lucide-react';  
import CategorySound from '../sounds/Category.mp3'

const Categories: React.FC = () => {
  const { todos, updateTodo } = useApp();
  console.log(todos);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTodo, setCurrentTodo] = React.useState<Todo | undefined>(undefined);

  const categories: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];

  const handelSpeek = () => {
    const audio = new Audio(CategorySound);
    audio.play();
  }

  const getCategoryIcon = (category: Category) => {
    let color;
    switch (category) {
      case 'Work':
        color = 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
        break;
      case 'Personal':
        color = 'text-purple-600 bg-purple-100 dark:bg-purple-800 dark:text-purple-200';
        break;
      case 'Shopping':
        color = 'text-emerald-600 bg-emerald-100 dark:bg-emerald-800 dark:text-emerald-200';
        break;
      case 'Health':
        color = 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200';
        break;
      case 'Finance':
        color = 'text-amber-600 bg-amber-100 dark:bg-amber-800 dark:text-amber-200';
        break;
      default:
        color = 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
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
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-4 min-h-screen transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Categories</h2>
        <button
          onClick={handelSpeek}
          aria-label="Play sound"
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Speaker size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryTodos = getTodosByCategory(category);
          return (
            <Card key={category} className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100">{category}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {categoryTodos.length} tasks
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                {categoryTodos.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
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
