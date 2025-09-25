// Simple linear programming solver using the graphical method
// This is a basic implementation for educational purposes

// Find intersection of two lines: a1*x + b1*y = c1 and a2*x + b2*y = c2
const findIntersection = (a1, b1, c1, a2, b2, c2) => {
  const determinant = a1 * b2 - a2 * b1;

  if (Math.abs(determinant) < 1e-10) {
    return null; // Lines are parallel
  }

  const x = (c1 * b2 - c2 * b1) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  return { x, y };
};

// Check if a point satisfies all constraints
const isPointFeasible = (x, y, constraints) => {
  if (x < -1e-6 || y < -1e-6) return false;

  for (const constraint of constraints) {
    const leftSide = constraint.coeffX * x + constraint.coeffY * y;
    const rightSide = constraint.value;

    switch (constraint.operator) {
      case '<=':
        if (leftSide > rightSide + 1e-6) return false;
        break;
      case '>=':
        if (leftSide < rightSide - 1e-6) return false;
        break;
      case '=':
        if (Math.abs(leftSide - rightSide) > 1e-6) return false;
        break;
      default:
        return false;
    }
  }

  return true;
};

// Find all corner points of the feasible region
const findCornerPoints = (constraints) => {
  const cornerPoints = [];

  // Add origin if feasible
  if (isPointFeasible(0, 0, constraints)) {
    cornerPoints.push({ x: 0, y: 0 });
  }

  const lines = [
    { a: 1, b: 0, c: 0 }, // x = 0
    { a: 0, b: 1, c: 0 }  // y = 0
  ];

  for (const constraint of constraints) {
    lines.push({
      a: constraint.coeffX,
      b: constraint.coeffY,
      c: constraint.value
    });
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const intersection = findIntersection(
        lines[i].a, lines[i].b, lines[i].c,
        lines[j].a, lines[j].b, lines[j].c
      );

      if (intersection && isPointFeasible(intersection.x, intersection.y, constraints)) {
        const exists = cornerPoints.some(point =>
          Math.abs(point.x - intersection.x) < 1e-6 &&
          Math.abs(point.y - intersection.y) < 1e-6
        );

        if (!exists) {
          cornerPoints.push(intersection);
        }
      }
    }
  }

  return cornerPoints;
};

// Main solver function
export const solveLinearProgram = (objective, constraints) => {
  try {
    const cornerPoints = findCornerPoints(constraints);

    if (cornerPoints.length === 0) {
      return {
        x: 0,
        y: 0,
        objectiveValue: 0,
        feasible: false
      };
    }

    let bestPoint = cornerPoints[0];
    let bestValue = objective.coeffX * bestPoint.x + objective.coeffY * bestPoint.y;

    for (const point of cornerPoints) {
      const objectiveValue = objective.coeffX * point.x + objective.coeffY * point.y;
      const isBetter = objective.type === 'maximize'
        ? objectiveValue > bestValue
        : objectiveValue < bestValue;

      if (isBetter) {
        bestPoint = point;
        bestValue = objectiveValue;
      }
    }

    return {
      x: Math.max(0, bestPoint.x),
      y: Math.max(0, bestPoint.y),
      objectiveValue: bestValue,
      feasible: true
    };

  } catch (error) {
    console.error('Error solving linear program:', error);
    return {
      x: 0,
      y: 0,
      objectiveValue: 0,
      feasible: false
    };
  }
};
