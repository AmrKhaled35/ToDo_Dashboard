import React from 'react';
import { BotIcon, UserIcon } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div 
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} group`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`max-w-[80%] px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          role === 'user'
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-700'
        }`}
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-1.5 rounded-full ${
            role === 'user' 
              ? 'bg-white/10' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
          }`}>
            {role === 'assistant' ? <BotIcon size={16} /> : <UserIcon size={16} />}
          </div>
          <span className="font-medium">{role === 'user' ? 'You' : 'AI Assistant'}</span>
          <span className="text-xs opacity-75">{formatTimestamp(timestamp)}</span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;