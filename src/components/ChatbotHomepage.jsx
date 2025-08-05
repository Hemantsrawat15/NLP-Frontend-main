import React, { useState } from 'react';
import { MessageCircle, Play, ArrowRight } from 'lucide-react';

const ChatbotHomepage = ({ onStartOptimization }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase().includes('start') || input.toLowerCase().includes('yes')) {
      onStartOptimization();
    }
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-3">
            <MessageCircle size={32} />
            <div>
              <h1 className="text-2xl font-bold">Linear Programming Assistant</h1>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="p-6 bg-white border-t flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your request to begin..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Optional direct start button */}
        <div className="p-6 pt-0">
          <button
            onClick={onStartOptimization}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
          >
            <Play size={24} />
            Start Optimization
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotHomepage;
