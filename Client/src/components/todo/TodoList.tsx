import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Todo, Category, Priority } from '../../types';
import TodoItem from './TodoItem';
import TodoModal from './TodoModal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useApp } from '../../context/AppContext';

interface TodoListProps {
  title?: string;
  showAddButton?: boolean;
  filter?: {
    search?: string;
    category?: Category;
    priority?: Priority;
    completed?: boolean;
  };
}

const TodoList: React.FC<TodoListProps> = ({
  title = 'Tasks',
  showAddButton = true,
  filter = {},
}) => {
  const { todos, addTodo, updateTodo, filterTodos } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filter.search || '');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>((filter.category as Category) || '');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>((filter.priority as Priority) || '');
  const [completedFilter, setCompletedFilter] = useState<string>(
    filter.completed !== undefined ? String(filter.completed) : ''
  );
  console.log(todos)

  const handleOpenModal = () => {
    setCurrentTodo(undefined);
    setIsModalOpen(true);
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
    } else {
      addTodo(todoData);
    }
    setIsModalOpen(false);
  };

  const filteredTodos = filterTodos({
    search: searchTerm,
    category: categoryFilter as Category | undefined,
    priority: priorityFilter as Priority | undefined,
    completed: completedFilter === '' ? undefined : completedFilter === 'true',
  });

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
  ];

  const completionOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'false', label: 'Active' },
    { value: 'true', label: 'Completed' },
  ];

  return (
    <div className="space-y-4 dark:bg-gray-900 dark:text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          {showAddButton && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={handleOpenModal}
            >
              Add Task
            </Button>
          )}
        </div>
      </div>

      <div className={`space-y-3 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              className="h-10"
              icon={<Search size={16} className="text-gray-400 dark:text-gray-500" />}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | '')}
              className="h-10"
            />
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
              className="h-10"
            />
            <Select
              options={completionOptions}
              value={completedFilter}
              onChange={(e) => setCompletedFilter(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No tasks found. Add a new task to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={handleEditTodo} />
          ))}
        </div>
      )}

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        todo={currentTodo}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TodoList;
