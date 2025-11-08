import React from 'react';

interface ConsumedStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface SummaryCardProps {
  consumedStats: ConsumedStats;
  calorieGoal: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ consumedStats, calorieGoal }) => {
  const { calories, protein, carbs, fat } = consumedStats;

  const calorieDiff = calories - calorieGoal;
  const isOver = calorieDiff > 0;
  const statusText = isOver ? `${Math.round(calorieDiff)} calories over` : `${Math.round(Math.abs(calorieDiff))} calories left`;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 w-full">
      <h2 className="text-xl font-bold text-slate-100 mb-6">Today's Summary</h2>
      
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-48 h-48 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(13, 74, 66, 0.3) 0%, rgba(15, 23, 42, 0.3) 100%)' }}>
          <div className="text-center">
            <span className="text-5xl font-extrabold text-slate-100">{Math.round(calories)}</span>
            <span className="text-slate-400 block text-sm">/ {Math.round(calorieGoal)} cal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-slate-700 p-3 rounded-xl">
            <p className="text-2xl font-bold text-slate-100">{Math.round(protein)}g</p>
            <p className="text-sm text-slate-400">Protein</p>
        </div>
        <div className="bg-slate-700 p-3 rounded-xl">
            <p className="text-2xl font-bold text-slate-100">{Math.round(carbs)}g</p>
            <p className="text-sm text-slate-400">Carbs</p>
        </div>
        <div className="bg-slate-700 p-3 rounded-xl">
            <p className="text-2xl font-bold text-slate-100">{Math.round(fat)}g</p>
            <p className="text-sm text-slate-400">Fat</p>
        </div>
      </div>

      <div className={`text-center font-semibold p-3 rounded-xl bg-slate-700`}>
        <span className={isOver ? 'text-red-400' : 'text-teal-400'}>
          {statusText}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;