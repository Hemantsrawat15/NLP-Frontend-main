import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ChatbotHomepage from './components/ChatbotHomepage';
import ConstraintTable from './components/ConstraintTable';
import OptimizationResults from './components/OptimizationResults';
import OptimizationVisualizer from './components/OptimizationVisualizer';
import Navigation from './components/Navigation';
import { solveLinearProgram } from './utils/linearProgrammingSolver';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [objective, setObjective] = useState(null);
  const [constraints, setConstraints] = useState([]);
  const [solution, setSolution] = useState(null);

  const handleStartOptimization = () => {
    navigate('/constraints');
  };

  const handleSolve = (objectiveFunction, problemConstraints) => {
    const result = solveLinearProgram(objectiveFunction, problemConstraints);
    setObjective(objectiveFunction);
    setConstraints(problemConstraints);
    setSolution(result);
    navigate('/results');
  };

  const handleVisualize = () => {
    navigate('/visualization');
  };

  const handleBackToResults = () => {
    navigate('/results');
  };

  const handleBackToConstraints = () => {
    navigate('/constraints');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {location.pathname !== '/' && (
        <Navigation 
          currentPath={location.pathname}
          onNavigateHome={handleBackToHome}
          onNavigateConstraints={handleBackToConstraints}
          onNavigateResults={handleBackToResults}
          onNavigateVisualization={handleVisualize}
          hasResults={!!solution}
        />
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={<ChatbotHomepage onStartOptimization={handleStartOptimization} />} 
        />
        <Route 
          path="/constraints" 
          element={<ConstraintTable onSolve={handleSolve} />} 
        />
        <Route 
          path="/results" 
          element={
            objective && solution ? (
              <OptimizationResults
                objective={objective}
                constraints={constraints}
                result={solution}
                onVisualize={handleVisualize}
              />
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">No Results Available</h1>
                  <p className="text-gray-600 mb-6">Please solve an optimization problem first.</p>
                  <button
                    onClick={() => navigate('/constraints')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Go to Constraints
                  </button>
                </div>
              </div>
            )
          } 
        />
        <Route 
          path="/visualization" 
          element={
            objective && solution ? (
              <OptimizationVisualizer
                objective={objective}
                constraints={constraints}
                result={solution}
                onBack={handleBackToResults}
              />
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">No Data to Visualize</h1>
                  <p className="text-gray-600 mb-6">Please solve an optimization problem first.</p>
                  <button
                    onClick={() => navigate('/constraints')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Go to Constraints
                  </button>
                </div>
              </div>
            )
          } 
        />
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page not found</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Go Home
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
