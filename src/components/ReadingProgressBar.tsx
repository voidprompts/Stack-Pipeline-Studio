import React, { useEffect, useState } from 'react';

export const ReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900/60 backdrop-blur-sm pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
