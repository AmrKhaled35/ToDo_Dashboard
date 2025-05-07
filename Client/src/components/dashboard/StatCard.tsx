
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  return (
    <Card className="dark:border-gray-700 dark:bg-gray-800">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
            {trend && (
              <p
                className={`text-xs mt-1 ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}%{' '}
                <span className="text-gray-500 dark:text-gray-400">vs last week</span>
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color} dark:text-white`}>{icon}</div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
