import React from 'react';
import { Moon, Sun, Monitor, Eye, EyeOff, List, Calendar as CalendarIcon, Columns } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Category, Priority } from '../types';
import Select from '../components/ui/Select';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          theme: newTheme,
        },
      });
    }
  };

  const handleCompletedTasksVisibility = (showCompletedTasks: boolean) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          showCompletedTasks,
        },
      });
    }
  };

  const handleDefaultViewChange = (defaultView: 'list' | 'calendar' | 'kanban') => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          defaultView,
        },
      });
    }
  };

  const handleDefaultCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          defaultCategory: e.target.value as Category,
        },
      });
    }
  };

  const handleDefaultPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (user) {
      updateUser({
        preferences: {
          ...user.preferences,
          defaultPriority: e.target.value as Priority,
        },
      });
    }
  };

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold dark:text-white">Appearance</h3>
          </CardHeader>
          <CardContent>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Theme</h4>
            <div className="flex space-x-3">
              <button
                className={`p-3 flex flex-col items-center rounded-lg border ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <Sun size={24} className="mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                className={`p-3 flex flex-col items-center rounded-lg border ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <Moon size={24} className="mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                className={`p-3 flex flex-col items-center rounded-lg border ${
                  theme === 'system'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleThemeChange('system')}
              >
                <Monitor size={24} className="mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold dark:text-white">Task Display</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Completed Tasks</h4>
              <div className="flex space-x-3">
                <button
                  className={`p-3 flex flex-col items-center rounded-lg border ${
                    user.preferences.showCompletedTasks
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleCompletedTasksVisibility(true)}
                >
                  <Eye size={24} className="mb-2" />
                  <span className="text-sm font-medium">Show</span>
                </button>
                <button
                  className={`p-3 flex flex-col items-center rounded-lg border ${
                    !user.preferences.showCompletedTasks
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleCompletedTasksVisibility(false)}
                >
                  <EyeOff size={24} className="mb-2" />
                  <span className="text-sm font-medium">Hide</span>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Default View</h4>
              <div className="flex space-x-3">
                <button
                  className={`p-3 flex flex-col items-center rounded-lg border ${
                    user.preferences.defaultView === 'list'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleDefaultViewChange('list')}
                >
                  <List size={24} className="mb-2" />
                  <span className="text-sm font-medium">List</span>
                </button>
                <button
                  className={`p-3 flex flex-col items-center rounded-lg border ${
                    user.preferences.defaultView === 'calendar'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleDefaultViewChange('calendar')}
                >
                  <CalendarIcon size={24} className="mb-2" />
                  <span className="text-sm font-medium">Calendar</span>
                </button>
                <button
                  className={`p-3 flex flex-col items-center rounded-lg border ${
                    user.preferences.defaultView === 'kanban'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleDefaultViewChange('kanban')}
                >
                  <Columns size={24} className="mb-2" />
                  <span className="text-sm font-medium">Kanban</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold dark:text-white">Default Task Options</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Default Category"
                  options={categoryOptions}
                  value={user.preferences.defaultCategory}
                  onChange={handleDefaultCategoryChange}
                  fullWidth
                />
              </div>
              <div>
                <Select
                  label="Default Priority"
                  options={priorityOptions}
                  value={user.preferences.defaultPriority}
                  onChange={handleDefaultPriorityChange}
                  fullWidth
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold dark:text-white">Account Preferences</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive email notifications for task reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-gray-700 dark:peer-checked:bg-indigo-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium dark:text-white">Sound Effects</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds when completing tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-gray-700 dark:peer-checked:bg-indigo-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium dark:text-white">Browser Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show browser notifications for upcoming tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-gray-700 dark:peer-checked:bg-indigo-500"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;