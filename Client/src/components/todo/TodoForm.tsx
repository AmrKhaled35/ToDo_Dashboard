import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Todo, Category, Priority } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { formatDateForInput } from '../../utils/helpers';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(
    todo?.dueDate ? formatDateForInput(todo.dueDate) : ''
  );
  const [priority, setPriority] = useState<Priority>(todo?.priority || 'medium');
  const [category, setCategory] = useState<Category>(todo?.category || 'personal');
  const [tags, setTags] = useState<string[]>(todo?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [titleError, setTitleError] = useState('');

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (title.trim()) {
      setTitleError('');
    }
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
      category,
      tags,
      completed: todo?.completed || false,
    });
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 dark:bg-gray-800 dark:text-white dark:border-gray-700">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        error={titleError}
        fullWidth
        autoFocus
        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          options={priorityOptions}
          fullWidth
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        options={categoryOptions}
        fullWidth
        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
          Tags
        </label>
        <div className="flex">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag and press Enter"
            className="flex-grow dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            variant="outline"
            className="ml-2 dark:border-gray-600 dark:text-white"
          >
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm dark:bg-indigo-600 dark:text-indigo-200"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="dark:border-gray-600 dark:text-white">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="dark:bg-indigo-600 dark:text-white">
          {todo ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;
