import React, { useState, useEffect, useRef } from 'react';

const OptimizationVisualizer = ({ 
  objective = { coeffX: 3, coeffY: 2, type: 'maximize' }, 
  constraints = [
    { id: '1', coeffX: 2, coeffY: 1, operator: '<=', value: 20 },
    { id: '2', coeffX: 1, coeffY: 2, operator: '<=', value: 16 },
    { id: '3', coeffX: 1, coeffY: 0, operator: '<=', value: 8 }
  ], 
  result = { x: 8, y: 4, objectiveValue: 32, feasible: true }
}) => {
  const canvasRef = useRef(null);
  
  const [parameters, setParameters] = useState({
    scale: 15,
    gridSize: 20,
    objectiveLines: 5
  });

  useEffect(() => {
    drawVisualization();
    return () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [objective, constraints, result, parameters]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up coordinate system
    const margin = 60;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;
    const maxX = parameters.scale;
    const maxY = parameters.scale;
    
    // Convert math coords to canvas
    const toCanvasX = (x) => margin + (x / maxX) * plotWidth;
    const toCanvasY = (y) => height - margin - (y / maxY) * plotHeight;
    
    // ==== GRID ====
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= parameters.gridSize; i++) {
      // Vertical grid lines
      const x = toCanvasX((i / parameters.gridSize) * maxX);
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, height - margin);
      ctx.stroke();

      // Horizontal grid lines
      const y = toCanvasY((i / parameters.gridSize) * maxY);
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }
    
    // ==== AXES ====
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= 5; i++) {
      const value = (i / 5) * maxX;
      ctx.fillText(value.toFixed(0), toCanvasX(value), height - margin + 20);
      ctx.fillText(value.toFixed(0), margin - 10, toCanvasY(value) + 5);
    }
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Variable x', width / 2, height - 10);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Variable y', 0, 0);
    ctx.restore();
    
    // ==== FEASIBLE REGION ====
    const feasiblePoints = [];
    const resolution = 50;
    
    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const x = (i / resolution) * maxX;
        const y = (j / resolution) * maxY;
        let feasible = x >= 0 && y >= 0;
        
        for (const c of constraints) {
          const left = c.coeffX * x + c.coeffY * y;
          if (c.operator === '<=') feasible &&= left <= c.value;
          if (c.operator === '>=') feasible &&= left >= c.value;
          if (c.operator === '=') feasible &&= Math.abs(left - c.value) < 0.1;
        }
        
        if (feasible) feasiblePoints.push({ x, y });
      }
    }
    
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    feasiblePoints.forEach(p => {
      ctx.fillRect(toCanvasX(p.x) - 1, toCanvasY(p.y) - 1, 2, 2);
    });
    
    // ==== CONSTRAINT LINES ====
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
    
    constraints.forEach((c, i) => {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      if (c.coeffY === 0) {
        // vertical line x = value / coeffX
        const xVal = c.value / c.coeffX;
        const cx = toCanvasX(xVal);
        ctx.moveTo(cx, margin);
        ctx.lineTo(cx, height - margin);
      } else {
        for (let x = 0; x <= maxX; x += 0.1) {
          const y = (c.value - c.coeffX * x) / c.coeffY;
          if (y >= 0 && y <= maxY) {
            const cx = toCanvasX(x);
            const cy = toCanvasY(y);
            if (x === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
        }
      }
      
      ctx.stroke();
    });
    
    // ==== OBJECTIVE LINES + OPTIMAL ====
    if (result?.feasible) {
      const optVal = result.objectiveValue;
      
      for (let i = 0; i < parameters.objectiveLines; i++) {
        const val = optVal * (0.2 + (i / (parameters.objectiveLines - 1)) * 0.8);
        const isOptimal = i === parameters.objectiveLines - 1;
        
        ctx.strokeStyle = isOptimal ? '#1e40af' : '#3b82f6';
        ctx.lineWidth = isOptimal ? 3 : 1;
        ctx.setLineDash(isOptimal ? [] : [5, 5]);
        
        ctx.beginPath();
        for (let x = 0; x <= maxX; x += 0.1) {
          const y = (val - objective.coeffX * x) / objective.coeffY;
          if (y >= 0 && y <= maxY) {
            const cx = toCanvasX(x);
            const cy = toCanvasY(y);
            if (x === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Optimal point
      const cx = toCanvasX(result.x);
      const cy = toCanvasY(result.y);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#111';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`(${result.x.toFixed(2)}, ${result.y.toFixed(2)})`, cx, cy - 12);
      ctx.fillText(`Value: ${result.objectiveValue.toFixed(2)}`, cx, cy + 20);
    }
    
    // Title
    ctx.fillStyle = '#111';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(
      `${objective.type === 'maximize' ? 'Maximize' : 'Minimize'}: ${objective.coeffX}x + ${objective.coeffY}y`,
      width / 2,
      30
    );
  };

  return (
    <div className="p-6 bg-white h-full">
      <h3 className="text-lg font-semibold mb-4">Graphical Visualization</h3>
      
      {/* Controls */}
      <div className="flex gap-6 mb-4">
        <div>
          <label className="block text-sm font-medium">Scale</label>
          <input
            aria-label="Scale"
            type="range"
            min="5"
            max="30"
            value={parameters.scale}
            onChange={(e) => setParameters({...parameters, scale: parseInt(e.target.value)})}
          />
          <span className="ml-2 text-sm">{parameters.scale}</span>
        </div>
        <div>
          <label className="block text-sm font-medium">Grid</label>
          <input
            aria-label="Grid size"
            type="range"
            min="10"
            max="50"
            value={parameters.gridSize}
            onChange={(e) => setParameters({...parameters, gridSize: parseInt(e.target.value)})}
          />
          <span className="ml-2 text-sm">{parameters.gridSize}</span>
        </div>
        <div>
          <label className="block text-sm font-medium">Objective Lines</label>
          <input
            aria-label="Objective function lines"
            type="range"
            min="3"
            max="10"
            value={parameters.objectiveLines}
            onChange={(e) => setParameters({...parameters, objectiveLines: parseInt(e.target.value)})}
          />
          <span className="ml-2 text-sm">{parameters.objectiveLines}</span>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4">
        <canvas ref={canvasRef} width={600} height={400} className="w-full" />
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-sm text-gray-600">
        <p><span className="inline-block w-4 h-3 bg-green-300 mr-2"></span>Feasible Region</p>
        <p><span className="inline-block w-4 h-3 bg-red-500 mr-2 rounded-full"></span>Optimal Solution</p>
        <p><span className="inline-block w-4 h-1 bg-blue-600 mr-2"></span>Objective Function Lines</p>
      </div>
    </div>
  );
};

export default OptimizationVisualizer;
