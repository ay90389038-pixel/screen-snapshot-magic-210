import React, { useState, useEffect } from 'react';
import { useStudent } from '@/context/StudentContext';

export const StudyTimer: React.FC = () => {
  const { user, logStudySession } = useStudent();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState('Science');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  if (!user) return null; // Only show for logged in students

  const handleStopAndSave = async () => {
    setIsActive(false);
    const minutes = Math.round(seconds / 60);
    if (minutes > 0) {
      await logStudySession(subject, 'General Practice', minutes);
      alert(`Logged ${minutes} minute(s) of ${subject} study time!`);
    }
    setSeconds(0);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 shadow-xl border border-slate-200 dark:border-slate-800">
      <select
        disabled={isActive}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="text-xs font-semibold bg-transparent border-0 focus:ring-0 text-slate-700 dark:text-slate-300"
      >
        <option value="Science">Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Social Science">Social Science</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
      </select>

      <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
        {formatTime(seconds)}
      </div>

      {!isActive ? (
        <button
          onClick={() => setIsActive(true)}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
        >
          Start
        </button>
      ) : (
        <button
          onClick={handleStopAndSave}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
        >
          Save
        </button>
      )}
    </div>
  );
};
