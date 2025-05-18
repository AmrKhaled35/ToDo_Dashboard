import  { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import TodoModal from '../components/todo/TodoModal';
import { useApp } from '../context/AppContext';
import { groupTodosByDate } from '../utils/helpers';
import { Todo } from '../types';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | undefined>(undefined);
  const { todos, addTodo, updateTodo } = useApp();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const previousMonthDays = [];
  const previousMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    previousMonthDays.push(previousMonthLastDay - i);
  }

  const nextMonthDays = [];
  const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
  const nextMonthDaysCount = totalCells - (previousMonthDays.length + daysInMonth);
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(i);
  }
  console.log(todos);
  const todosByDate = groupTodosByDate(todos);
  console.log(todosByDate);
  const getTodosForDate = (date: Date): Todo[] => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return todosByDate[dateString] || [];
  };
  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddTodo = (date: Date) => {
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

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Calendar</h2>
        <div className="flex items-center space-x-4">
          <Button className="dark:text-white dark:border-gray-700" variant="outline" size="sm" onClick={handlePreviousMonth} icon={<ChevronLeft size={16} />}>
            Previous
          </Button>
          <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
            {currentMonthName} {currentYear}
          </span>
          <Button className="dark:text-white dark:border-gray-700" variant="outline" size="sm" onClick={handleNextMonth} icon={<ChevronRight size={16} />}>
            Next
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {previousMonthDays.map((day) => (
            <div
              key={`prev-${day}`}
              className="h-32 p-2 border-b border-r text-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
            >
              <div className="text-sm">{day}</div>
            </div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = new Date().toDateString() === date.toDateString();
            console.log(date);
            const dayTodos = getTodosForDate(date);
            console.log(dayTodos);
            return (
              <div
                key={`current-${day}`}
                className={`h-32 p-2 border-b border-r relative cursor-pointer dark:border-gray-700 ${
                  isToday ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => handleAddTodo(date)}
              >
                <div className={`flex justify-between items-center ${isToday ? 'font-bold text-indigo-600' : ''}`}>
                  <span
                    className={`text-sm ${
                      isToday
                        ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {day}
                  </span>
                </div>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-24">
                  {dayTodos.map((t: Todo) => (
                    <div
                      key={t.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${
                        t.completed
                          ? 'bg-gray-100 text-gray-500 line-through dark:bg-gray-700 dark:text-gray-400'
                          : t.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : t.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTodo(t);
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {nextMonthDays.map((day) => (
            <div
              key={`next-${day}`}
              className="h-32 p-2 border-b border-r text-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
            >
              <div className="text-sm">{day}</div>
            </div>
          ))}
        </div>
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

export default Calendar;