import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, BotIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import MessageBubble from '../components/ai/MessageBubble';
import TypingIndicator from '../components/ai/TypingIndicator';
import { sendMessageToAI } from '../services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AskGpt: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(({ role, content }) => ({ role, content }));
      const aiResponse = await sendMessageToAI({
        message: inputMessage,
        modelId: 'gpt-4.1',
        conversation: conversationHistory,
      });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <Card className="flex-grow flex flex-col h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-none shadow-xl">
        <CardContent className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-75 blur-lg animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BotIcon size={48} className="text-white" />
                </div>
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  AI Assistant
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask me anything! I'm here to help with your questions, tasks, or creative endeavors.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              fullWidth
              disabled={isLoading}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AskGpt;
