import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';

const OptimizationVisualizer = ({ 
  objective = { coeffX: 3, coeffY: 2, type: 'Maximize' }, 
  constraints = [
    { id: '1', coeffX: 2, coeffY: 1, operator: '<=', value: 20 },
    { id: '2', coeffX: 1, coeffY: 2, operator: '<=', value: 16 },
    { id: '3', coeffX: 1, coeffY: 0, operator: '<=', value: 8 }
  ], 
  result = { x: 8, y: 4, objectiveValue: 32, feasible: true }, 
  onBack = () => {} 
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const [parameters, setParameters] = useState({
    gridResolution: { value: 20, min: 10, max: 50 },
    objectiveLines: { value: 5, min: 3, max: 10 },
    feasibleRegionOpacity: { value: 0.3, min: 0.1, max: 0.8 },
    constraintSensitivity: { value: 1.0, min: 0.5, max: 2.0 },
    visualizationScale: { value: 15, min: 5, max: 30 }
  });

  // Generate visualization data
  const generateVisualizationData = () => {
    const scale = parameters.visualizationScale.value;
    const resolution = parameters.gridResolution.value;
    const objLines = parameters.objectiveLines.value;
    
    // Generate constraint boundary lines
    const feasiblePoints = [];
    
    // Create grid points to check feasibility
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = (i / resolution) * scale;
        const y = (j / resolution) * scale;
        
        // Check if point satisfies all constraints
        let feasible = x >= 0 && y >= 0; // Non-negativity constraints
        
        for (const constraint of constraints) {
          const leftSide = constraint.coeffX * x + constraint.coeffY * y;
          const rightSide = constraint.value;
          
          switch (constraint.operator) {
            case '<=':
              feasible = feasible && leftSide <= rightSide;
              break;
            case '>=':
              feasible = feasible && leftSide >= rightSide;
              break;
            case '=':
              feasible = feasible && Math.abs(leftSide - rightSide) < 0.1;
              break;
          }
        }
        
        if (feasible) {
          feasiblePoints.push({ x, y });
        }
      }
    }
    
    // Generate objective function iso-lines
    const objectiveLines = [];
    const optimalValue = result.objectiveValue;
    
    for (let i = 0; i < objLines; i++) {
      const lineValue = optimalValue * (0.2 + (i / (objLines - 1)) * 0.8);
      const linePoints = [];
      
      for (let x = 0; x <= scale; x += 0.5) {
        if (objective.coeffY !== 0) {
          const y = (lineValue - objective.coeffX * x) / objective.coeffY;
          if (y >= 0 && y <= scale) {
            linePoints.push({ x, y });
          }
        }
      }
      
      objectiveLines.push({
        label: `Objective = ${lineValue.toFixed(2)}`,
        data: linePoints,
        borderColor: `hsl(${240 + i * 20}, 70%, ${50 + i * 5}%)`,
        backgroundColor: 'transparent',
        borderWidth: i === objLines - 1 ? 4 : 2,
        fill: false,
        tension: 0,
        pointRadius: 0,
        borderDash: i === objLines - 1 ? [] : [5, 5],
        type: 'line'
      });
    }
    
    // Create datasets
    const datasets = [
      ...objectiveLines,
      {
        label: 'Feasible Region',
        data: feasiblePoints.map(p => ({ x: p.x, y: p.y })),
        backgroundColor: `rgba(34, 197, 94, ${parameters.feasibleRegionOpacity.value})`,
        borderColor: 'transparent',
        pointRadius: 2,
        pointHoverRadius: 3,
        type: 'scatter'
      },
      {
        label: 'Optimal Solution',
        data: [{ x: result.x, y: result.y }],
        backgroundColor: 'rgb(239, 68, 68)',
        borderColor: 'white',
        borderWidth: 3,
        pointRadius: 12,
        pointHoverRadius: 15,
        type: 'scatter'
      }
    ];
    
    // Add constraint boundary lines
    constraints.forEach((constraint, index) => {
      const boundaryPoints = [];
      
      // Generate boundary line points
      for (let x = 0; x <= scale; x += 0.1) {
        if (constraint.coeffY !== 0) {
          const y = (constraint.value - constraint.coeffX * x) / constraint.coeffY;
          if (y >= 0 && y <= scale) {
            boundaryPoints.push({ x, y });
          }
        }
      }
      
      if (boundaryPoints.length > 0) {
        datasets.push({
          label: `Constraint ${index + 1}: ${constraint.coeffX}x + ${constraint.coeffY}y ${constraint.operator} ${constraint.value}`,
          data: boundaryPoints,
          borderColor: `hsl(${index * 60}, 80%, 50%)`,
          backgroundColor: 'transparent',
          borderWidth: 3,
          fill: false,
          tension: 0,
          pointRadius: 0,
          type: 'line'
        });
      }
    });
    
    return { datasets };
  };
  
  const updateChart = () => {
    if (chartInstance.current) {
      chartInstance.current.data = generateVisualizationData();
      chartInstance.current.update('active');
    }
  };

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Register Chart.js components
    Chart.Chart.register(
      Chart.LineController,
      Chart.LineElement,
      Chart.PointElement,
      Chart.LinearScale,
      Chart.CategoryScale,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend,
      Chart.ScatterController
    );
    
    chartInstance.current = new Chart.Chart(ctx, {
      type: 'line',
      data: generateVisualizationData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { size: 11 },
              color: '#374151',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15
            }
          },
          title: {
            display: true,
            text: `Linear Programming Visualization - ${objective.type} ${objective.coeffX}x + ${objective.coeffY}y`,
            font: { size: 16, weight: 'bold' },
            color: '#1f2937',
            padding: { top: 20, bottom: 20 }
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const point = context[0];
                return `Point (${point.parsed.x.toFixed(2)}, ${point.parsed.y.toFixed(2)})`;
              },
              label: (context) => {
                const objValue = objective.coeffX * context.parsed.x + objective.coeffY * context.parsed.y;
                return [
                  `Dataset: ${context.dataset.label}`,
                  `Objective Value: ${objValue.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Variable x',
              font: { size: 14, weight: 'bold' },
              color: '#4b5563'
            },
            min: 0,
            max: parameters.visualizationScale.value,
            grid: { color: 'rgba(156, 163, 175, 0.3)' },
            ticks: { color: '#6b7280' }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Variable y',
              font: { size: 14, weight: 'bold' },
              color: '#4b5563'
            },
            min: 0,
            max: parameters.visualizationScale.value,
            grid: { color: 'rgba(156, 163, 175, 0.3)' },
            ticks: { color: '#6b7280' }
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  
  useEffect(() => {
    updateChart();
  }, [parameters]);
  
  const handleParameterChange = (paramName, value) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: { ...prev[paramName], value }
    }));
  };
  
  const parameterLabels = {
    gridResolution: 'Grid Resolution',
    objectiveLines: 'Objective Lines',
    feasibleRegionOpacity: 'Feasible Region Opacity',
    constraintSensitivity: 'Constraint Sensitivity',
    visualizationScale: 'Visualization Scale'
  };
  
  const getParameterIcon = (param) => {
    const icons = {
      gridResolution: '📊',
      objectiveLines: '📈',
      feasibleRegionOpacity: '👁️',
      constraintSensitivity: '⚡',
      visualizationScale: '🔍'
    };
    return icons[param] || '⚙️';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 Optimization Visualization
          </h1>
          <p className="text-gray-700 text-lg">
            Interactive visualization of your linear programming solution
          </p>
        </div>
        
        {/* Solution Summary */}
        <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Optimal Solution:</span>
              <span className="ml-2 font-bold text-purple-600">
                x = {result.x.toFixed(2)}, y = {result.y.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Objective Value:</span>
              <span className="ml-2 font-bold text-green-600">
                {result.objectiveValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-full h-96 md:h-[500px] relative">
              <canvas 
                ref={chartRef}
                className="w-full h-full"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          </div>
        </div>
        
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              🎛️ Visualization Controls
            </h2>
            
            <div className="space-y-6">
              {Object.entries(parameters).map(([key, param]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span>{getParameterIcon(key)}</span>
                      <span className="text-xs">{parameterLabels[key]}</span>
                    </label>
                    <span className="text-sm font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded text-xs">
                      {param.value.toFixed(param.value < 1 ? 2 : 0)}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.max > 10 ? 1 : 0.1}
                      value={param.value}
                      onChange={(e) => handleParameterChange(key, parseFloat(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{param.min}</span>
                      <span>{param.max}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Control Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <button
                onClick={() => setParameters({
                  gridResolution: { value: 20, min: 10, max: 50 },
                  objectiveLines: { value: 5, min: 3, max: 10 },
                  feasibleRegionOpacity: { value: 0.3, min: 0.1, max: 0.8 },
                  constraintSensitivity: { value: 1.0, min: 0.5, max: 2.0 },
                  visualizationScale: { value: 15, min: 5, max: 30 }
                })}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                🔄 Reset Defaults
              </button>
              <button
                onClick={updateChart}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                📊 Refresh Visualization
              </button>
              <button
                onClick={onBack}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(147, 51, 234, 0.3);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #7c3aed);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(147, 51, 234, 0.3);
        }
        
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
        }
        
        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default OptimizationVisualizer;