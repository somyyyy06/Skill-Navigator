import { useState, useEffect, useCallback } from 'react';

export function useStepTimer(stepId: number | undefined, isActive: boolean = true) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused || !stepId) return;

    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, stepId]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimeSpent(0);
  }, []);

  return { 
    timeSpent, 
    setIsPaused, 
    formatTime,
    resetTimer,
    isPaused 
  };
}
