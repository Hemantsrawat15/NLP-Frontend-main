import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, TrendingUp, Target, Eye, Settings } from 'lucide-react';
import OptimizationVisualizer from './OptimizationVisualizer';

const OptimizationPanel = ({ optimizationData, onSolveOptimization }) => {
  const [activeTab, setActiveTab] = useState('setup');
  const [localObjective, setLocalObjective] = useState(optimizationData.objective);
  const [localConstraints, setLocalConstraints] = useState(optimizationData.constraints);

  useEffect(() => {
    setLocalObjective(optimizationData.objective);
    setLocalConstraints(optimizationData.constraints);
  }, [optimizationData]);

  const addConstraint = () => {
    const newId = (localConstraints.length + 1).toString();
    setLocalConstraints([
      ...localConstraints,
      { id: newId, coeffX: 1, coeffY: 1, operator: '<=', value: 5 }
    ]);
  };

  const removeConstraint = (id) => {
    if (localConstraints.length > 1) {
      setLocalConstraints(localConstraints.filter(c => c.id !== id));
    }
  };

  const updateConstraint = (id, field, value) => {
    setLocalConstraints(localConstraints.map(c =>
      c.id === id ? { ...c, [field]: field === 'operator' ? value : parseFloat(value) || 0 } : c
    ));
  };

  const updateObjective = (field, value) => {
    setLocalObjective({
      ...localObjective,
      [field]: field === 'type' ? value : parseFloat(value) || 0
    });
  };

  const handleSolve = () => {
    onSolveOptimization(localObjective, localConstraints);
    setActiveTab('results');
  };

  const formatEquation = (coeffX, coeffY, operator, value) => {
    const xTerm = coeffX === 1 ? 'x' : coeffX === -1 ? '-x' : `${coeffX}x`;
    const yTerm = coeffY === 1 ? 'y' : coeffY === -1 ? '-y' : `${coeffY}y`;
    const sign = coeffY >= 0 ? '+' : '';
    return `${xTerm} ${sign} ${yTerm} ${operator} ${value}`;
  };

  const formatNumber = (num) => Number(num.toFixed(4));

  const checkConstraintSatisfaction = (constraint, x, y) => {
    const leftSide = constraint.coeffX * x + constraint.coeffY * y;
    const rightSide = constraint.value;

    switch (constraint.operator) {
      case '<=':
        return leftSide <= rightSide + 1e-6;
      case '>=':
        return leftSide >= rightSide - 1e-6;
      case '=':
        return Math.abs(leftSide - rightSide) < 1e-6;
      default:
        return false;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-1">
          {[
            { id: 'setup', label: 'Problem Setup', icon: Settings },
            { id: 'results', label: 'Results', icon: TrendingUp },
            { id: 'visualization', label: 'Graph', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div className="p-6 space-y-6">
            {/* Objective Function */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="text-blue-600" size={20} />
                Objective Function
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={localObjective.type}
                    onChange={(e) => updateObjective('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="maximize">Maximize</option>
                    <option value="minimize">Minimize</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient of x</label>
                  <input
                    type="number"
                    value={localObjective.coeffX}
                    onChange={(e) => updateObjective('coeffX', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient of y</label>
                  <input
                    type="number"
                    value={localObjective.coeffY}
                    onChange={(e) => updateObjective('coeffY', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  Current Objective: <span className="font-mono">{localObjective.type === 'maximize' ? 'Maximize' : 'Minimize'} {localObjective.coeffX}x + {localObjective.coeffY}y</span>
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calculator className="text-green-600" size={20} />
                  Constraints
                </h3>
                <button
                  onClick={addConstraint}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="space-y-4">
                {localConstraints.map((constraint, index) => (
                  <div key={constraint.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      {/* Coeff X */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Coeff X</label>
                        <input
                          type="number"
                          value={constraint.coeffX}
                          onChange={(e) => updateConstraint(constraint.id, 'coeffX', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {/* Coeff Y */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Coeff Y</label>
                        <input
                          type="number"
                          value={constraint.coeffY}
                          onChange={(e) => updateConstraint(constraint.id, 'coeffY', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {/* Operator */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Operator</label>
                        <select
                          value={constraint.operator}
                          onChange={(e) => updateConstraint(constraint.id, 'operator', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="<=">&le;</option>
                          <option value=">=">&ge;</option>
                          <option value="=">=</option>
                        </select>
                      </div>
                      {/* Value */}
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                        <input
                          type="number"
                          value={constraint.value}
                          onChange={(e) => updateConstraint(constraint.id, 'value', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      {/* Preview */}
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Preview</label>
                        <div className="bg-white border border-gray-200 rounded px-2 py-1 text-sm font-mono text-blue-600">
                          {formatEquation(constraint.coeffX, constraint.coeffY, constraint.operator, constraint.value)}
                        </div>
                      </div>
                      {/* Delete */}
                      <div className="col-span-1">
                        <button
                          onClick={() => removeConstraint(constraint.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors duration-200"
                          disabled={localConstraints.length <= 1}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg"
            >
              <Calculator size={24} />
              Solve Optimization Problem
            </button>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && optimizationData.result && (
          <div className="p-6 space-y-6">
            {optimizationData.result.feasible ? (
              <>
                {/* Solution Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold">Optimal Point</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600">x = {formatNumber(optimizationData.result.x)}</p>
                      <p className="text-2xl font-bold text-blue-600">y = {formatNumber(optimizationData.result.y)}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="text-green-600" size={24} />
                      <h3 className="text-lg font-semibold">Objective Value</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {formatNumber(optimizationData.result.objectiveValue)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {optimizationData.objective.type === 'maximize' ? 'Maximum' : 'Minimum'} value achieved
                    </p>
                  </div>
                </div>

                {/* Constraint Analysis */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Constraint Analysis</h3>
                  <div className="space-y-3">
                    {localConstraints.map((constraint, index) => {
                      const leftValue = constraint.coeffX * optimizationData.result.x + constraint.coeffY * optimizationData.result.y;
                      const satisfied = checkConstraintSatisfaction(constraint, optimizationData.result.x, optimizationData.result.y);
                      const utilization = constraint.operator === '<=' ? (leftValue / constraint.value) * 100 : 100;
                      
                      return (
                        <div key={constraint.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">
                              Constraint {index + 1}: {formatEquation(constraint.coeffX, constraint.coeffY, constraint.operator, constraint.value)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              satisfied ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {satisfied ? 'Satisfied' : 'Violated'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Value: {formatNumber(leftValue)} {constraint.operator} {constraint.value}</span>
                            {constraint.operator === '<=' && (
                              <span>Utilization: {formatNumber(utilization)}%</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <div className="text-red-600 text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">No Feasible Solution</h3>
                <p className="text-red-600">
                  The current constraints do not have a feasible solution. Please review and modify your constraints.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Visualization Tab */}
        {activeTab === 'visualization' && (
          <div className="h-full">
            <OptimizationVisualizer
              objective={optimizationData.objective}
              constraints={optimizationData.constraints}
              result={optimizationData.result}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationPanel;
