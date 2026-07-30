import { CalculatorService } from '../src/calculator/services/calculator.service';
import { BadRequestException } from '@nestjs/common';

/**
 * Unit tests for the mathematical engine.
 *
 * Test data is derived from known functions so we can verify
 * the numerical derivative against the analytical derivative.
 */
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    service = new CalculatorService();
  });

  // ────────────────────────────────────────────
  // Difference Table
  // ────────────────────────────────────────────

  describe('computeDifferenceTable', () => {
    it('should compute correct difference table for cubic', () => {
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65]; // x³ + 1

      const result = service.computeDifferenceTable(x, y);

      expect(result.rawTable[0]).toEqual([1, 2, 9, 28, 65]);   // y
      expect(result.rawTable[1]).toEqual([1, 7, 19, 37]);       // Δy
      expect(result.rawTable[2]).toEqual([6, 12, 18]);          // Δ²y
      expect(result.rawTable[3]).toEqual([6, 6]);               // Δ³y
      expect(result.rawTable[4]).toEqual([0]);                  // Δ⁴y
    });

    it('should return the correct number of display rows', () => {
      const x = [0, 1, 2, 3];
      const y = [0, 1, 8, 27]; // x³

      const result = service.computeDifferenceTable(x, y);
      expect(result.table.length).toBe(4);
      expect(result.maxOrder).toBe(3);
    });
  });

  // ────────────────────────────────────────────
  // Newton Forward Difference
  // ────────────────────────────────────────────

  describe('computeNewtonForward', () => {
    it('should compute exact derivative for cubic at x = 1.5', () => {
      // f(x) = x³ + 1, f'(x) = 3x², f'(1.5) = 6.75
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65];

      const result = service.computeNewtonForward(x, y, 1.5);
      expect(result.derivative).toBeCloseTo(6.75, 6);
      expect(result.method).toBe('newton-forward');
      expect(result.h).toBe(1);
      expect(result.u).toBe(1.5);
    });

    it('should compute correct derivative for quadratic', () => {
      // f(x) = x², f'(x) = 2x, f'(0.5) = 1
      const x = [0, 1, 2, 3];
      const y = [0, 1, 4, 9];

      const result = service.computeNewtonForward(x, y, 0.5);
      expect(result.derivative).toBeCloseTo(1.0, 6);
    });

    it('should return a complete step-by-step solution', () => {
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65];

      const result = service.computeNewtonForward(x, y, 1.5);
      expect(result.steps.length).toBe(6);
      expect(result.steps[0].title).toContain('Difference Table');
      expect(result.steps[5].title).toBe('Final Answer');
    });

    it('should include the formula in KaTeX', () => {
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65];

      const result = service.computeNewtonForward(x, y, 1.5);
      expect(result.formula).toContain('\\Delta');
      expect(result.formula).toContain('\\frac{1}{h}');
    });

    it('should measure execution time', () => {
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65];

      const result = service.computeNewtonForward(x, y, 1.5);
      expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ────────────────────────────────────────────
  // Newton Backward Difference
  // ────────────────────────────────────────────

  describe('computeNewtonBackward', () => {
    it('should compute exact derivative for cubic at x = 3.5', () => {
      // f(x) = x³ + 1, f'(x) = 3x², f'(3.5) = 36.75
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65];

      const result = service.computeNewtonBackward(x, y, 3.5);
      expect(result.derivative).toBeCloseTo(36.75, 6);
      expect(result.method).toBe('newton-backward');
    });

    it('should compute correct derivative for quadratic', () => {
      // f(x) = x², f'(x) = 2x, f'(2.5) = 5
      const x = [0, 1, 2, 3];
      const y = [0, 1, 4, 9];

      const result = service.computeNewtonBackward(x, y, 2.5);
      expect(result.derivative).toBeCloseTo(5.0, 6);
    });

    it('should use backward differences (last diagonal)', () => {
      const x = [0, 1, 2, 3, 4];
      const y = [1, 2, 9, 28, 65];

      const result = service.computeNewtonBackward(x, y, 4);
      // At x = xₙ, u = 0. So only the first-order term survives.
      // ∇yₙ = Δy_{n-1} = y[4] - y[3] = 65 - 28 = 37
      // But higher-order terms also contribute via their coefficients at u=0
      // For u=0: coeff_1 = 1, coeff_2 = (0+1)/2 = 0.5, coeff_3 = (0+0+2)/6 = 1/3, etc.
      expect(result.derivative).toBeCloseTo(48, 4); // f'(4) = 3*16 = 48
    });
  });

  // ────────────────────────────────────────────
  // Validation
  // ────────────────────────────────────────────

  describe('Validation', () => {
    it('should reject mismatched array lengths', () => {
      expect(() =>
        service.computeNewtonForward([1, 2, 3], [1, 2], 1.5),
      ).toThrow(BadRequestException);
    });

    it('should reject fewer than 3 points', () => {
      expect(() =>
        service.computeNewtonForward([1, 2], [3, 4], 1.5),
      ).toThrow(BadRequestException);
    });

    it('should reject unequal spacing', () => {
      expect(() =>
        service.computeNewtonForward([0, 1, 3], [0, 1, 9], 0.5),
      ).toThrow(BadRequestException);
    });

    it('should reject duplicate x values', () => {
      expect(() =>
        service.computeNewtonForward([1, 1, 2], [0, 1, 4], 1.5),
      ).toThrow(BadRequestException);
    });

    it('should reject non-finite values', () => {
      expect(() =>
        service.computeNewtonForward([0, 1, 2], [Infinity, 1, 4], 1),
      ).toThrow(BadRequestException);
    });
  });

  // ────────────────────────────────────────────
  // Edge cases
  // ────────────────────────────────────────────

  describe('Edge cases', () => {
    it('should handle linear data (zero higher differences)', () => {
      // f(x) = 2x + 1, f'(x) = 2
      const x = [0, 1, 2, 3, 4];
      const y = [1, 3, 5, 7, 9];

      const forward = service.computeNewtonForward(x, y, 2.5);
      expect(forward.derivative).toBeCloseTo(2.0, 10);

      const backward = service.computeNewtonBackward(x, y, 2.5);
      expect(backward.derivative).toBeCloseTo(2.0, 10);
    });

    it('should handle negative values', () => {
      const x = [-2, -1, 0, 1, 2];
      const y = [4, 1, 0, 1, 4]; // x²

      const result = service.computeNewtonForward(x, y, 0.5);
      // f'(0.5) = 2*0.5 = 1
      expect(result.derivative).toBeCloseTo(1.0, 6);
    });

    it('should handle decimal spacing', () => {
      const x = [0.0, 0.5, 1.0, 1.5, 2.0];
      const y = x.map((v) => v * v); // x²

      const result = service.computeNewtonForward(x, y, 0.75);
      expect(result.derivative).toBeCloseTo(1.5, 6); // f'(0.75) = 2*0.75
    });
  });
});
