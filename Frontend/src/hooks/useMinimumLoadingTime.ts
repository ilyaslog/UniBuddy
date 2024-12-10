import { useState, useEffect } from 'react';

export function useMinimumLoadingTime(minimumTime: number = 1500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minimumTime);

    return () => clearTimeout(timer);
  }, [minimumTime]);

  return isLoading;
}