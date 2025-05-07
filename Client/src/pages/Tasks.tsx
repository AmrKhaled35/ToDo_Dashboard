import React from 'react';
import TodoList from '../components/todo/TodoList';

const Tasks: React.FC = () => {
  return (
    <div>
      <TodoList title="All Tasks" />
    </div>
  );
};

export default Tasks;