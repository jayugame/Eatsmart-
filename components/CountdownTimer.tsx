import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiryTimestamp: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTimestamp }) => {
  const calculateTimeLeft = () => {
    const difference = expiryTimestamp - new Date().getTime();
    let timeLeft = {
      hours: '00',
      minutes: '00',
      seconds: '00',
    };

    if (difference > 0) {
      timeLeft = {
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 w-full text-center animate-fade-in-up">
      <h3 className="text-sm font-semibold text-slate-400 mb-2">Today's plan will reset in</h3>
      <div className="flex justify-center items-baseline space-x-2">
        <div>
          <span className="text-3xl font-bold text-slate-100">{timeLeft.hours}</span>
          <span className="text-xs text-slate-400 ml-1">h</span>
        </div>
        <span className="text-3xl font-bold text-slate-500">:</span>
        <div>
          <span className="text-3xl font-bold text-slate-100">{timeLeft.minutes}</span>
          <span className="text-xs text-slate-400 ml-1">m</span>
        </div>
        <span className="text-3xl font-bold text-slate-500">:</span>
        <div>
          <span className="text-3xl font-bold text-slate-100">{timeLeft.seconds}</span>
          <span className="text-xs text-slate-400 ml-1">s</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;