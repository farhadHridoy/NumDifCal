import { Injectable } from '@nestjs/common';
import { WorkedExample } from '../interfaces/calculation-result.interface';

/**
 * ExamplesService — Pre-built worked examples for one-click loading.
 */
@Injectable()
export class ExamplesService {
  private readonly examples: WorkedExample[] = [
    {
      id: 'cubic-forward',
      title: 'Cubic Polynomial — Forward Difference',
      description:
        'Find f′(1.5) for f(x) = x³ + 1 using Newton Forward Difference.',
      xValues: [0, 1, 2, 3, 4],
      yValues: [1, 2, 9, 28, 65],
      targetX: 1.5,
      method: 'newton-forward',
    },
    {
      id: 'cubic-backward',
      title: 'Cubic Polynomial — Backward Difference',
      description:
        'Find f′(3.5) for f(x) = x³ + 1 using Newton Backward Difference.',
      xValues: [0, 1, 2, 3, 4],
      yValues: [1, 2, 9, 28, 65],
      targetX: 3.5,
      method: 'newton-backward',
    },
    {
      id: 'cubic-forward-2nd',
      title: 'Cubic Polynomial — 2nd Derivative (Forward)',
      description:
        'Find f′′(1.5) for f(x) = x³ + 1 using Newton Forward Difference.',
      xValues: [0, 1, 2, 3, 4],
      yValues: [1, 2, 9, 28, 65],
      targetX: 1.5,
      method: 'newton-forward',
      derivativeOrder: 2,
    },
    {
      id: 'cubic-backward-2nd',
      title: 'Cubic Polynomial — 2nd Derivative (Backward)',
      description:
        'Find f′′(3.5) for f(x) = x³ + 1 using Newton Backward Difference.',
      xValues: [0, 1, 2, 3, 4],
      yValues: [1, 2, 9, 28, 65],
      targetX: 3.5,
      method: 'newton-backward',
      derivativeOrder: 2,
    },
    {
      id: 'quadratic-forward',
      title: 'Quadratic Function — Forward Difference',
      description:
        'Find f′(0.1) from the given tabulated data using Newton Forward Difference.',
      xValues: [0.0, 0.2, 0.4, 0.6, 0.8],
      yValues: [1.0, 1.2214, 1.4918, 1.8221, 2.2255],
      targetX: 0.1,
      method: 'newton-forward',
    },
    {
      id: 'sin-backward',
      title: 'Sine Function — Backward Difference',
      description:
        'Find f′(1.29) from tabulated sin(x) using Newton Backward Difference.',
      xValues: [1.0, 1.1, 1.2, 1.3, 1.4],
      yValues: [0.8415, 0.8912, 0.9320, 0.9636, 0.9854],
      targetX: 1.29,
      method: 'newton-backward',
    },
    {
      id: 'exponential-forward',
      title: 'Exponential Function — Forward Difference',
      description:
        'Find f′(1.22) from tabulated eˣ data using Newton Forward Difference.',
      xValues: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
      yValues: [2.7183, 3.0042, 3.3201, 3.6693, 4.0552, 4.4817],
      targetX: 1.22,
      method: 'newton-forward',
    },
    {
      id: 'log-backward',
      title: 'Logarithmic Function — Backward Difference',
      description:
        'Find f′(2.36) from tabulated log₁₀(x) data using Newton Backward Difference.',
      xValues: [2.0, 2.1, 2.2, 2.3, 2.4],
      yValues: [0.3010, 0.3222, 0.3424, 0.3617, 0.3802],
      targetX: 2.36,
      method: 'newton-backward',
    },
  ];

  getAll(): WorkedExample[] {
    return this.examples;
  }

  getById(id: string): WorkedExample | undefined {
    return this.examples.find((e) => e.id === id);
  }
}
