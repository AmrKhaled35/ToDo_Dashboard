import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ListChecks,
  CalendarCheck,
  BarChart3
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<ListChecks size={24} className="text-indigo-600" />}
          color="bg-indigo-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle size={24} className="text-emerald-600" />}
          color="bg-emerald-100"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          icon={<Clock size={24} className="text-amber-600" />}
          color="bg-amber-100"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={<AlertTriangle size={24} className="text-red-600" />}
          color="bg-red-100"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-800">Task Progress</h2>
            </CardHeader>
            <CardContent>
              <div className="mb-4 ">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-medium">{stats.completionRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-semibold">{stats.pending}</p>
                    </div>
                    <CalendarCheck className="text-indigo-500" size={24} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-xl font-semibold">{stats.completed}</p>
                    </div>
                    <CheckCircle className="text-emerald-500" size={24} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.categoryCounts).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${category === 'work' ? 'bg-blue-500' : category === 'personal' ? 'bg-purple-500' : category === 'shopping' ? 'bg-emerald-500' : category === 'health' ? 'bg-green-500' : category === 'finance' ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
                        <span className="capitalize">{category}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-800">Recent Tasks</h2>
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