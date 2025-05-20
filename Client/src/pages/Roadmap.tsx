import React, { useState } from 'react';
import { Plus, ChevronRight, Check, Calendar, Tag, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Milestone, Todo, Priority, Category } from '../types/index';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Roadmap: React.FC = () => {
  const { todos, addTodo, updateTodo } = useApp();
  const [showNewMilestone, setShowNewMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Project Planning',
      description: 'Initial project setup and planning phase',
      dueDate: '2024-04-01',
      completed: true,
      color: 'from-blue-500 to-blue-600',
      tasks: []
    },
    {
      id: '2',
      title: 'Development Phase',
      description: 'Core development and implementation',
      dueDate: '2024-05-15',
      completed: false,
      color: 'from-purple-500 to-purple-600',
      tasks: []
    },
    {
      id: '3',
      title: 'Testing & QA',
      description: 'Quality assurance and testing phase',
      dueDate: '2024-06-01',
      completed: false,
      color: 'from-emerald-500 to-emerald-600',
      tasks: []
    }
  ]);

  // Group todos by milestone based on tags
  const getMilestoneTasks = (milestoneId: string) => {
    return todos.filter(todo => 
      todo.tags.includes(`milestone-${milestoneId}`)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim() || !newMilestoneDate) {
      toast.error('Please fill in all milestone details');
      return;
    }

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      description: '',
      dueDate: newMilestoneDate,
      completed: false,
      color: `from-${getRandomColor()}-500 to-${getRandomColor()}-600`,
      tasks: []
    };

    setMilestones([...milestones, newMilestone]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    setShowNewMilestone(false);
    toast.success('Milestone added successfully');
  };

  const getRandomColor = () => {
    const colors = ['blue', 'purple', 'emerald', 'indigo', 'rose', 'amber'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAddTask = async (milestoneId: string) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const newTask: Omit<Todo, 'id' | 'createdAt'> = {
      title: `New task for ${milestone.title}`,
      description: '',
      completed: false,
      dueDate: milestone.dueDate,
      priority: 'medium' as Priority,
      category: 'Work' as Category,
      tags: [`milestone-${milestoneId}`],
      userId: '1'
    };

    try {
      await addTodo(newTask);
      toast.success('Task added to milestone');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleTask = async (todo: Todo) => {
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const calculateMilestoneProgress = (milestoneTasks: Todo[]) => {
    if (milestoneTasks.length === 0) return 0;
    const completed = milestoneTasks.filter(task => task.completed).length;
    return Math.round((completed / milestoneTasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Project Roadmap</h2>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setShowNewMilestone(true)}
        >
          Add Milestone
        </Button>
      </div>

      {showNewMilestone && (
        <Card className="p-4 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <Input
              label="Milestone Title"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="Enter milestone title"
            />
            <Input
              label="Due Date"
              type="date"
              value={newMilestoneDate}
              onChange={(e) => setNewMilestoneDate(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewMilestone(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddMilestone}
              >
                Add Milestone
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400"></div>

        <div className="space-y-8">
          {milestones.map((milestone) => {
            const milestoneTasks = getMilestoneTasks(milestone.id);
            const progress = calculateMilestoneProgress(milestoneTasks);
            
            return (
              <div key={milestone.id} className="relative">
                <div className="flex items-start group">
                  <div className={`absolute left-8 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r ${milestone.color} shadow-lg transform transition-transform group-hover:scale-110`}>
                    {progress === 100 && (
                      <Check size={12} className="absolute inset-0 m-auto text-white" />
                    )}
                  </div>

                  <div className="ml-16 flex-1">
                    <Card className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {milestone.title}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(milestone.dueDate)}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Tag size={14} className="mr-1" />
                                {milestoneTasks.length} tasks
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <AlertCircle size={14} className="mr-1" />
                                {progress}% complete
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${milestone.color}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>

                        <div className="space-y-3">
                          {milestoneTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`flex items-center p-3 rounded-lg ${
                                task.completed
                                  ? 'bg-gray-50 dark:bg-gray-700/50'
                                  : 'bg-white dark:bg-gray-700'
                              }`}
                              onClick={() => handleToggleTask(task)}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                task.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 dark:border-gray-500'
                              }`}>
                                {task.completed && (
                                  <Check size={12} className="text-white" />
                                )}
                              </div>
                              <span className={`flex-1 ${
                                task.completed
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-700 dark:text-gray-200'
                              }`}>
                                {task.title}
                              </span>
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTask(milestone.id)}
                          >
                            Add Task
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;