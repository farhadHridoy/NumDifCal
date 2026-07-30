'use client';

import { useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Download, Image, FileText } from 'lucide-react';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { exportToPng, exportToSvg, exportToPdf } from '@/lib/export';
import type { CalculationResult } from '@/types/calculator';

interface GraphProps {
  result: CalculationResult;
}

/**
 * Interactive Recharts graph displaying the original data points,
 * an interpolation curve, and the differentiation point.
 */
export function Graph({ result }: GraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Build data for the chart
  const dataPoints = result.xValues.map((x, i) => ({
    x,
    y: result.yValues[i],
  }));

  // Generate interpolation curve points
  const minX = Math.min(...result.xValues);
  const maxX = Math.max(...result.xValues);
  const range = maxX - minX;
  const curvePoints: { x: number; y: number }[] = [];

  for (let i = 0; i <= 100; i++) {
    const x = minX + (range * i) / 100;
    // Simple Lagrange interpolation for the smooth curve
    let y = 0;
    for (let j = 0; j < result.xValues.length; j++) {
      let basis = result.yValues[j];
      for (let k = 0; k < result.xValues.length; k++) {
        if (k !== j) {
          basis *= (x - result.xValues[k]) / (result.xValues[j] - result.xValues[k]);
        }
      }
      y += basis;
    }
    curvePoints.push({ x: parseFloat(x.toFixed(6)), y: parseFloat(y.toFixed(6)) });
  }

  // Merge data for Recharts
  const chartData = curvePoints.map((pt) => ({
    x: pt.x,
    curve: pt.y,
    dataPoint: dataPoints.find((d) => Math.abs(d.x - pt.x) < range * 0.005)?.y,
  }));

  // Find the target point y on the curve
  const targetY = curvePoints.reduce((closest, pt) =>
    Math.abs(pt.x - result.targetX) < Math.abs(closest.x - result.targetX) ? pt : closest,
  ).y;

  return (
    <div className="glass rounded-[var(--radius-xl)] shadow-lg overflow-hidden flex flex-col relative w-full p-8">
      <div className="relative flex items-center justify-center mb-6 min-h-[44px]">
        <h3 className="text-[18px] font-bold text-[var(--color-text-primary)] text-center w-full">
          Interactive Graph
        </h3>
        <div className="absolute right-2 flex items-center gap-2 bg-[var(--color-surface-elevated)] p-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <button
            onClick={() => chartRef.current && exportToPng(chartRef.current, result.method, result.targetX)}
            className="flex items-center gap-1.5 px-3 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[12px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label="Download as PNG"
          >
            <Image size={14} /> PNG
          </button>
          <button
            onClick={() => chartRef.current && exportToSvg(chartRef.current, result.method, result.targetX)}
            className="flex items-center gap-1.5 px-3 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[12px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label="Download as SVG"
          >
            <Download size={14} /> SVG
          </button>
          <button
            onClick={() => chartRef.current && exportToPdf(chartRef.current, result.method, result.targetX)}
            className="flex items-center gap-1.5 px-3 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)] transition-colors text-[12px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            aria-label="Download as PDF"
          >
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      <div
        ref={chartRef}
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 md:p-6 bg-[var(--color-surface-elevated)]"
      >
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4F46FF" />
                <stop offset="50%" stopColor="#6D63FF" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              label={{
                value: 'x',
                position: 'insideBottomRight',
                offset: -10,
                style: { fontSize: 13, fill: 'var(--color-text-secondary)' },
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              label={{
                value: 'f(x)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 13, fill: 'var(--color-text-secondary)' },
              }}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                fontSize: '13px',
              }}
              labelFormatter={(value) => `x = ${value}`}
            />
            <Legend
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
            />
            {/* Interpolation curve */}
            <Line
              type="monotone"
              dataKey="curve"
              stroke="url(#curveGradient)"
              strokeWidth={3.5}
              dot={false}
              name="Interpolation Curve"
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            {/* Original data points */}
            <Line
              type="monotone"
              dataKey="dataPoint"
              stroke="transparent"
              dot={{
                fill: '#4F46FF',
                stroke: '#fff',
                strokeWidth: 2,
                r: 5,
              }}
              name="Data Points"
              connectNulls={false}
              animationDuration={1000}
            />
            {/* Target point */}
            <ReferenceDot
              x={result.targetX}
              y={targetY}
              r={10}
              fill="#A855F7"
              stroke="#fff"
              strokeWidth={3}
              label={{
                value: `x = ${result.targetX}`,
                position: 'top',
                style: { fontSize: 12, fontWeight: 600, fill: '#A855F7' },
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
