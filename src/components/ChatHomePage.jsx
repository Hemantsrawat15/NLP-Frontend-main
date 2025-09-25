import React, { useState } from 'react';
import {
  Send,
  MessageCircle,
  Calculator,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Play,
  X,
  Users,
  Award,
} from 'lucide-react';

const ChatHomePage = ({ onChatSubmit }) => {
  const [input, setInput] = useState('');
  const [showVideo, setShowVideo] = useState(false); // 👈 controls tutorial visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    onChatSubmit(input.trim());
    setInput('');
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  const features = [
    {
      icon: Calculator,
      title: 'Linear Programming',
      description: 'Solve complex optimization problems with our advanced LP solver.',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Visualization',
      description: 'See your optimization problems with interactive graphs.',
    },
    {
      icon: Lightbulb,
      title: 'AI-Powered Assistant',
      description: 'Get intelligent help for your optimization challenges.',
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Learn operations research concepts with tutorials.',
    },
  ];

  const suggestedQuestions = [
    'Solve a linear programming problem',
    'Maximize profit optimization',
    'Explain the simplex method',
    'What is the feasible region?',
    'Minimize cost problem',
    'Help with constraints',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Calculator className="text-blue-300" size={24} />
            <span className="text-white font-semibold text-lg">OR-NLP Optimization Suite</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Operations Research using{' '}
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NLP
            </span>
            <br />
          </h1>
        </div>

        {/* Tutorial Button + Video */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 mx-auto shadow-lg"
            >
              <Play size={24} /> Watch Tutorial
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 relative">
              {/* Close button */}
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2"
              >
                <X className="text-white" size={20} />
              </button>

              <h2 className="text-3xl font-bold text-white text-center mb-8">
                📚 Operations Research & NLP Tutorial
              </h2>
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/2ACJ9ewUC6U"
                    title="Operations Research and Linear Programming Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-xl"
                  ></iframe>
                </div>
              </div>
              <p className="text-blue-100 text-center mt-6 text-lg">
                Watch this comprehensive tutorial to understand the fundamentals of Operations
                Research and get started with linear programming concepts.
              </p>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
                <MessageCircle className="text-blue-300" size={24} />
                <span className="text-white font-semibold text-lg">AI Optimization Assistant</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ask Your Operations Research Questions
              </h2>
              <p className="text-blue-100 text-lg">
                Get instant help with linear programming, optimization problems, and OR concepts
              </p>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="mb-2">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about linear programming, request optimization, or get help with OR concepts..."
                  className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                  <Send size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHomePage;
