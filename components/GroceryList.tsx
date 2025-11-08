import React from 'react';

interface GroceryListProps {
  ingredients: string[];
}

const GroceryList: React.FC<GroceryListProps> = ({ ingredients }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-100 mb-4 text-center">Your Grocery List</h2>
      <div className="max-h-96 overflow-y-auto pr-4 custom-scrollbar">
        <ul className="space-y-3">
          {ingredients.map((item, index) => (
            <li key={index} className="flex items-center bg-slate-700 p-3 rounded-lg border-l-4 border-teal-500">
              <input 
                id={`item-${index}`}
                type="checkbox" 
                className="h-5 w-5 rounded border-gray-300 text-teal-500 focus:ring-teal-400 accent-teal-500" 
              />
              <label htmlFor={`item-${index}`} className="ml-3 text-slate-300 select-none cursor-pointer w-full">
                {item}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroceryList;