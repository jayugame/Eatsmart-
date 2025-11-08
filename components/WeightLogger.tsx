import React, { useState, useEffect } from 'react';

interface WeightLoggerProps {
  onLogWeight: (weight: number) => void;
  currentWeight: number | '';
}

const WeightLogger: React.FC<WeightLoggerProps> = ({ onLogWeight, currentWeight }) => {
  const [weight, setWeight] = useState(currentWeight);

  useEffect(() => {
    setWeight(currentWeight);
  }, [currentWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight) {
      onLogWeight(Number(weight));
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h3 className="text-xl font-bold text-slate-100 mb-4">Log Your Weight</h3>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
          placeholder="Enter weight in kg"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition text-slate-200"
          required
        />
        <button
          type="submit"
          className="bg-teal-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-all duration-300 disabled:bg-teal-800"
          disabled={!weight}
        >
          Log
        </button>
      </form>
    </div>
  );
};

export default WeightLogger;