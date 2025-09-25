import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Calculator, TrendingUp, User, Bot, Lightbulb } from 'lucide-react';
import OptimizationPanel from './OptimizationPanel';

const ChatInterface = ({ optimizationData, onSolveOptimization }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Operations Research assistant. I can help you with linear programming problems, optimization techniques, and provide visual solutions. What would you like to optimize today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on input
    setTimeout(() => {
      const botResponse = generateBotResponse(input.trim().toLowerCase());
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // If the input suggests solving an optimization problem
      if (input.toLowerCase().includes('solve') || 
          input.toLowerCase().includes('optimize') || 
          input.toLowerCase().includes('maximize') || 
          input.toLowerCase().includes('minimize')) {
        // Trigger optimization with default or extracted values
        setTimeout(() => {
          onSolveOptimization(optimizationData.objective, optimizationData.constraints);
        }, 1000);
      }
    }, 1500);
  };

  const generateBotResponse = (input) => {
    let response = "";
    
    if (input.includes('linear programming') || input.includes('linear program')) {
      response = "Linear Programming is a mathematical optimization technique used to find the best outcome in a mathematical model whose requirements are represented by linear relationships. It's widely used in business, economics, and engineering to maximize profit or minimize cost. Would you like me to help you set up a linear programming problem?";
    } else if (input.includes('maximize') || input.includes('minimize')) {
      response = "I can help you solve optimization problems! I see you want to optimize something. Let me set up a linear programming problem for you. I'll display the objective function, constraints, and provide a visual solution on the left panel. You can modify the coefficients and constraints as needed.";
    } else if (input.includes('solve') || input.includes('optimization')) {
      response = "Great! I'll solve the current optimization problem for you. The solution will appear on the left panel with detailed analysis including the optimal point, objective value, and constraint satisfaction. You'll also see a graphical visualization of the feasible region and optimal solution.";
    } else if (input.includes('constraint')) {
      response = "Constraints are restrictions or limitations in optimization problems. They define the feasible region where solutions must lie. Common types include: ≤ (less than or equal), ≥ (greater than or equal), and = (equality). Each constraint represents a boundary in the solution space.";
    } else if (input.includes('feasible')) {
      response = "The feasible region is the set of all points that satisfy all constraints simultaneously. The optimal solution to a linear programming problem always lies at a corner point (vertex) of this feasible region. This is why we use the corner point method to solve LP problems.";
    } else if (input.includes('simplex')) {
      response = "The Simplex Method is an algorithmic approach for solving linear programming problems. It moves from one corner point of the feasible region to another, improving the objective function value at each step until the optimal solution is found. It's very efficient for problems with many variables.";
    } else if (input.includes('duality')) {
      response = "Every linear programming problem has an associated dual problem. If the primal problem is maximization, the dual is minimization (and vice versa). The optimal values of both problems are equal at optimality. Duality provides economic interpretation and sensitivity analysis insights.";
    } else if (input.includes('help') || input.includes('how')) {
      response = "I can help you with various Operations Research topics:\n\n• Linear Programming problem setup and solving\n• Constraint analysis and feasibility checking\n• Graphical method visualization\n• Sensitivity analysis\n• Duality theory\n• Optimization interpretation\n\nJust describe your problem or ask about any OR concept!";
    } else {
      response = "That's an interesting question about Operations Research! I can help you with linear programming, optimization problems, constraint analysis, and provide visual solutions. Try asking me to 'solve an optimization problem' or 'explain linear programming concepts'. What specific aspect would you like to explore?";
    }

    return {
      id: Date.now(),
      type: 'bot',
      content: response,
      timestamp: new Date()
    };
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "Solve a linear programming problem",
    "Explain the simplex method",
    "What is the feasible region?",
    "How do I set up constraints?",
    "Maximize profit optimization",
    "Minimize cost problem"
  ];

  return (
    <div className="flex h-screen bg-gray-50 pt-16">
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
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">OR-NLP Assistant</h2>
              <p className="text-blue-100 text-sm">Operations Research & Optimization Expert</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-br from-green-500 to-blue-600 text-white'
                }`}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
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
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <Lightbulb size={16} />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-xs bg-white hover:bg-blue-50 text-gray-700 px-3 py-2 rounded-full border border-gray-200 transition-colors duration-200 hover:border-blue-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about linear programming, optimization, or request problem solving..."
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

export default ChatInterface;