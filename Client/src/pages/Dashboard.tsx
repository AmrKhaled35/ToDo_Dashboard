import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ListChecks,
  CalendarCheck,
} from 'lucide-react';
import TodoList from '../components/todo/TodoList';
import StatCard from '../components/dashboard/StatCard';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { calculateStats } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { todos } = useApp();
  const stats = calculateStats(todos);

  return (
    <div className="space-y-6 dark:text-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<ListChecks size={24} className="text-indigo-600 dark:text-indigo-200" />}
          color="bg-indigo-100 dark:bg-indigo-700"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle size={24} className="text-emerald-600 dark:text-emerald-200" />}
          color="bg-emerald-100 dark:bg-emerald-700"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          icon={<Clock size={24} className="text-amber-600 dark:text-amber-200" />}
          color="bg-amber-100 dark:bg-amber-700"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={<AlertTriangle size={24} className="text-red-600 dark:text-red-200" />}
          color="bg-red-100 dark:bg-red-700"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="dark:border-gray-700">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Task Progress</h2>
            </CardHeader>
            <CardContent>
              <div className="mb-4 ">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-medium">{stats.completionRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-xl font-semibold">{stats.pending}</p>
                    </div>
                    <CalendarCheck className="text-indigo-500" size={24} />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                      <p className="text-xl font-semibold">{stats.completed}</p>
                    </div>
                    <CheckCircle className="text-emerald-500" size={24} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card className="dark:border-gray-700">
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Categories</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${category === 'work' ? 'bg-blue-500' : category === 'personal' ? 'bg-purple-500' : category === 'shopping' ? 'bg-emerald-500' : category === 'health' ? 'bg-green-500' : category === 'finance' ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
                        <span className="capitalize dark:text-white">{category}</span>
                      </div>
                      <span className="font-medium dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="h-full flex flex-col dark:border-gray-700">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Tasks</h2>
            </CardHeader>
            <CardContent className="flex-grow">
              <TodoList
                title=""
                showAddButton={false}
                filter={{ completed: false }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
