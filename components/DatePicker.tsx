import React from 'react';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
    // Format date to YYYY-MM-DD for input[type=date] value
    const toInputFormat = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // The value from input is a YYYY-MM-DD string.
        // new Date(string) can have timezone issues.
        // Splitting and constructing ensures it's treated as local time.
        const [year, month, day] = e.target.value.split('-').map(Number);
        onDateChange(new Date(year, month - 1, day));
    };

    // Format date for display, e.g., 08/11/2025
    const toDisplayFormat = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return (
        <div className="flex justify-center mb-6">
            <div className="relative inline-block">
                <input
                    type="date"
                    value={toInputFormat(selectedDate)}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Select date"
                />
                <div className="border border-slate-600 rounded-full px-4 py-2 text-sm font-semibold text-slate-300 flex items-center bg-slate-700 hover:bg-slate-600 transition pointer-events-none">
                    <span>{toDisplayFormat(selectedDate)}</span>
                    <svg className="w-4 h-4 ml-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;