import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageCircle,
  Calculator,
  TrendingUp,
  User,
  Bot,
  Lightbulb,
  Home,
  ArrowLeft
} from 'lucide-react';
import OptimizationPanel from './OptimizationPanel';

const OptimizationInterface = ({
  optimizationData,
  onSolveOptimization,
  chatMessages,
  onChatSubmit,
  onBackToHome
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    onChatSubmit(input.trim());
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const suggestedQuestions = [
    'Modify the objective function',
    'Add more constraints',
    'Explain the solution',
    'What is sensitivity analysis?',
    'Change to minimization',
    'Show feasible region'
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Optimization */}
      <div className="w-1/2 bg-white border-r border-gray-200 overflow-hidden">
        <OptimizationPanel
          optimizationData={optimizationData}
          onSolveOptimization={onSolveOptimization}
        />
      </div>

      {/* Right Panel - Chat */}
      <div className="w-1/2 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">OR-NLP Assistant</h2>
                <p className="text-blue-100 text-sm">
                  Operations Research & Optimization Expert
                </p>
              </div>
            </div>
            <button
              onClick={onBackToHome}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors duration-200 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Back to Home</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Initial bot message */}
          {chatMessages.length === 0 && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm max-w-xs lg:max-w-md">
                <p className="text-sm leading-relaxed text-gray-800">
                  Hello! I've set up an optimization problem for you. You can see
                  the objective function, constraints, and solution on the left
                  panel. Feel free to ask questions or request modifications!
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  {formatTime(new Date())}
                </p>
              </div>
            </div>
          )}

          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-3 max-w-xs lg:max-w-md ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-br from-green-500 to-blue-600 text-white'
                  }`}
                >
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        

        {/* Input Form */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the solution, modify constraints, or request explanations..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OptimizationInterface;
