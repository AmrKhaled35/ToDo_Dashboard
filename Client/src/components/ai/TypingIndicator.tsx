import React from 'react';
import { BotIcon } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <BotIcon size={16} />
          </div>
          <span className="font-medium">AI Assistant</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Thinking...</p>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;