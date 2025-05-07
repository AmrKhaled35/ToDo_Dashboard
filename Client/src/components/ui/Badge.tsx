import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white',
    primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-600 dark:text-amber-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
    outline: 'bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400',
  };
  
  const classes = `${baseClass} ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
