import React from 'react';
import { BarChart, TrendingUp, Target, Eye } from 'lucide-react';

const OptimizationResults = ({
  objective,
  constraints,
  result,
  onVisualize
}) => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Optimization Results</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
            result.feasible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {result.feasible ? '✅ Feasible Solution Found' : '❌ No Feasible Solution'}
          </div>
        </div>

        {result.feasible && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Optimal Point</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">x = {formatNumber(result.x)}</p>
                  <p className="text-2xl font-bold text-blue-600">y = {formatNumber(result.y)}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Objective Value</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {formatNumber(result.objectiveValue)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {objective.type === 'maximize' ? 'Maximum' : 'Minimum'} value achieved
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart className="text-purple-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Calculation</h3>
                </div>
                <p className="text-lg font-mono text-purple-600">
                  {objective.coeffX} × {formatNumber(result.x)} + {objective.coeffY} × {formatNumber(result.y)}
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  = {formatNumber(result.objectiveValue)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                📊 Detailed Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Component</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Expression</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Value</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium">Objective Function</td>
                      <td className="border border-gray-200 px-4 py-3 font-mono">
                        {objective.type}: {objective.coeffX}x + {objective.coeffY}y
                      </td>
                      <td className="border border-gray-200 px-4 py-3 font-bold text-green-600">
                        {formatNumber(result.objectiveValue)}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          Optimized
                        </span>
                      </td>
                    </tr>
                    {constraints.map((constraint, index) => {
                      const leftValue = constraint.coeffX * result.x + constraint.coeffY * result.y;
                      const satisfied = checkConstraintSatisfaction(constraint, result.x, result.y);
                      return (
                        <tr key={constraint.id} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            Constraint {index + 1}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 font-mono">
                            {constraint.coeffX}x + {constraint.coeffY}y {constraint.operator} {constraint.value}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            {formatNumber(leftValue)} {constraint.operator} {constraint.value}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              satisfied 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {satisfied ? 'Satisfied' : 'Violated'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                📈 Sensitivity Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Variable Ranges</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Variable x:</span>
                        <span className="font-bold text-blue-600">{formatNumber(result.x)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Contribution to objective: {formatNumber(objective.coeffX * result.x)}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Variable y:</span>
                        <span className="font-bold text-green-600">{formatNumber(result.y)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Contribution to objective: {formatNumber(objective.coeffY * result.y)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Constraint Utilization</h4>
                  <div className="space-y-3">
                    {constraints.map((constraint, index) => {
                      const leftValue = constraint.coeffX * result.x + constraint.coeffY * result.y;
                      const utilization = constraint.operator === '<=' 
                        ? (leftValue / constraint.value) * 100 
                        : 100;
                      return (
                        <div key={constraint.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Constraint {index + 1}:</span>
                            <span className="font-bold">{formatNumber(utilization)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                utilization > 95 ? 'bg-red-500' : 
                                utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <button
            onClick={onVisualize}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-3 mx-auto shadow-lg"
          >
            <Eye size={24} />
            Visualize Optimization
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationResults;
