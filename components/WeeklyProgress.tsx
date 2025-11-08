import React from 'react';
import { WeightEntry } from '../types';

interface WeeklyProgressProps {
  weightHistory: WeightEntry[];
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ weightHistory }) => {
  const data = weightHistory.slice(-7);

  if (data.length < 2) {
    return (
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
        <h3 className="text-xl font-bold text-slate-100 mb-2">Weekly Progress</h3>
        <div className="text-center py-8 bg-slate-700 rounded-lg">
            <p className="text-slate-400">Log your weight for a few days to see your progress chart here!</p>
        </div>
      </div>
    );
  }

  const width = 350;
  const height = 150;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight;

  const getX = (index: number) => (index / (data.length - 1)) * chartWidth + padding;
  const getY = (weight: number) => height - padding - ((weight - minWeight) / weightRange) * chartHeight;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.weight)}`).join(' ');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Weekly Progress (kg)</h3>
      <div className="w-full flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Y-axis labels */}
          <text x={padding - 5} y={padding} dy="0.3em" textAnchor="end" className="text-xs fill-slate-400">{Math.ceil(maxWeight)}</text>
          <text x={padding - 5} y={height - padding} dy="0.3em" textAnchor="end" className="text-xs fill-slate-400">{Math.floor(minWeight)}</text>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#475569" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="1" />

          {/* Line Chart */}
          <path d={linePath} stroke="#2dd4bf" strokeWidth="2" fill="none" />

          {/* Data Points */}
          {data.map((d, i) => (
            <circle key={i} cx={getX(i)} cy={getY(d.weight)} r="3" fill="#2dd4bf" stroke="#1e293b" strokeWidth="2" />
          ))}

           {/* X-axis labels */}
          <text x={padding} y={height - padding + 15} textAnchor="start" className="text-xs fill-slate-400">{formatDate(data[0].date)}</text>
          <text x={width - padding} y={height - padding + 15} textAnchor="end" className="text-xs fill-slate-400">{formatDate(data[data.length-1].date)}</text>
        </svg>
      </div>
    </div>
  );
};

export default WeeklyProgress;