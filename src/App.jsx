import React, { useState } from 'react';
import ChatHomePage from './components/ChatHomePage';
import OptimizationInterface from './components/OptimizationInterface';
import { solveLinearProgram } from './utils/solver';

function App() {
  const [currentView, setCurrentView] = useState('chat-home');
  const [optimizationData, setOptimizationData] = useState({
    objective: { coeffX: 2, coeffY: 3, type: 'maximize' },
    constraints: [
      { id: '1', coeffX: 1, coeffY: 1, operator: '<=', value: 10 },
      { id: '2', coeffX: 2, coeffY: 1, operator: '<=', value: 16 },
      { id: '3', coeffX: 1, coeffY: 2, operator: '<=', value: 12 },
    ],
    result: null,
  });
  const [chatMessages, setChatMessages] = useState([]);

  const handleChatSubmit = (message) => {
    const newMessages = [
      ...chatMessages,
      {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      },
    ];
    setChatMessages(newMessages);

    // Trigger optimization and switch to split view
    const result = solveLinearProgram(
      optimizationData.objective,
      optimizationData.constraints
    );
    setOptimizationData((prev) => ({ ...prev, result }));
    setCurrentView('optimization');

    // Add bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message.toLowerCase());
      setChatMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (input) => {
    let response = '';

    if (input.includes('linear programming') || input.includes('linear program')) {
      response =
        "I've set up a linear programming problem for you! On the left, you can see the objective function and constraints. The graph shows the feasible region and optimal solution. Linear Programming is used to find the best outcome when requirements are represented by linear relationships.";
    } else if (
      input.includes('maximize') ||
      input.includes('minimize') ||
      input.includes('optimize')
    ) {
      response =
        "Great! I've solved the optimization problem for you. The left panel shows the detailed solution including the optimal point, objective value, and constraint analysis. You can modify the coefficients and constraints to explore different scenarios.";
    } else if (input.includes('solve') || input.includes('help')) {
      response =
        "I've solved the current linear programming problem! The optimal solution is displayed on the left with a complete analysis. You can see the feasible region, constraint boundaries, and the optimal point marked in red on the graph.";
    } else {
      response =
        "I've set up an optimization problem based on your query! The left panel shows the problem setup, solution, and visualization. You can modify the objective function and constraints to explore different optimization scenarios.";
    }

    return {
      id: Date.now() + 1,
      type: 'bot',
      content: response,
      timestamp: new Date(),
    };
  };

  const handleSolveOptimization = (objective, constraints) => {
    const result = solveLinearProgram(objective, constraints);
    setOptimizationData({
      objective,
      constraints,
      result,
    });
  };

  const handleBackToHome = () => {
    setCurrentView('chat-home');
    setChatMessages([]);
    setOptimizationData((prev) => ({ ...prev, result: null }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'chat-home' && (
        <ChatHomePage onChatSubmit={handleChatSubmit} />
      )}

      {currentView === 'optimization' && (
        <OptimizationInterface
          optimizationData={optimizationData}
          onSolveOptimization={handleSolveOptimization}
          chatMessages={chatMessages}
          onChatSubmit={handleChatSubmit}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
