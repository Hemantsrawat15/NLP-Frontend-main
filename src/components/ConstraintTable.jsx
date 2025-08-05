import React, { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';

const ConstraintTable = ({ onSolve }) => {
  const [objective, setObjective] = useState({ coeffX: 2, coeffY: 3, type: 'maximize' });
  const [constraints, setConstraints] = useState([
    { id: '1', coeffX: 1, coeffY: 1, operator: '<=', value: 10 },
    { id: '2', coeffX: 2, coeffY: 1, operator: '<=', value: 16 },
    { id: '3', coeffX: 1, coeffY: 2, operator: '<=', value: 12 },
  ]);

  const addConstraint = () => {
    const newId = (constraints.length + 1).toString();
    setConstraints([...constraints, { id: newId, coeffX: 1, coeffY: 1, operator: '<=', value: 5 }]);
  };

  const removeConstraint = (id) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const updateConstraint = (id, field, value) => {
    setConstraints(constraints.map(c => 
      c.id === id ? { ...c, [field]: field === 'operator' ? value : parseFloat(value) || 0 } : c
    ));
  };

  const formatEquation = (coeffX, coeffY, operator, value) => {
    const xTerm = coeffX === 1 ? 'x' : coeffX === -1 ? '-x' : `${coeffX}x`;
    const yTerm = coeffY === 1 ? 'y' : coeffY === -1 ? '-y' : `${coeffY}y`;
    const sign = coeffY >= 0 ? '+' : '';
    return `${xTerm} ${sign} ${yTerm} ${operator} ${value}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Linear Programming Setup</h1>
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-2">Current Objective Function:</h2>
            <p className="text-2xl font-mono text-blue-600">
              {objective.type === 'maximize' ? 'Maximize' : 'Minimize'}: {objective.coeffX}x + {objective.coeffY}y
            </p>
          </div>
        </div>

        {/* Objective Function Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">🎯 Objective Function</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={objective.type}
                onChange={(e) => setObjective({...objective, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="maximize">Maximize</option>
                <option value="minimize">Minimize</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient of x</label>
              <input
                type="number"
                value={objective.coeffX}
                onChange={(e) => setObjective({...objective, coeffX: parseFloat(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient of y</label>
              <input
                type="number"
                value={objective.coeffY}
                onChange={(e) => setObjective({...objective, coeffY: parseFloat(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Constraints Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">📋 Constraints</h3>
            <button
              onClick={addConstraint}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Constraint
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="grid gap-4">
              {/* Header */}
              <div className="grid grid-cols-6 gap-4 font-semibold text-gray-700 text-sm">
                <div>Coefficient of x</div>
                <div>Coefficient of y</div>
                <div>Operator</div>
                <div>Value</div>
                <div>Equation Preview</div>
                <div>Actions</div>
              </div>

              {/* Constraints */}
              {constraints.map((constraint) => (
                <div key={constraint.id} className="grid grid-cols-6 gap-4 items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="number"
                    value={constraint.coeffX}
                    onChange={(e) => updateConstraint(constraint.id, 'coeffX', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={constraint.coeffY}
                    onChange={(e) => updateConstraint(constraint.id, 'coeffY', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={constraint.operator}
                    onChange={(e) => updateConstraint(constraint.id, 'operator', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="<=">&le;</option>
                    <option value=">=">&ge;</option>
                    <option value="=">=</option>
                  </select>
                  <input
                    type="number"
                    value={constraint.value}
                    onChange={(e) => updateConstraint(constraint.id, 'value', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {formatEquation(constraint.coeffX, constraint.coeffY, constraint.operator, constraint.value)}
                  </div>
                  <button
                    onClick={() => removeConstraint(constraint.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                    disabled={constraints.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solve Button */}
        <div className="text-center">
          <button
            onClick={() => onSolve(objective, constraints)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-3 mx-auto shadow-lg"
          >
            <Calculator size={24} />
            Solve Optimization Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstraintTable;
