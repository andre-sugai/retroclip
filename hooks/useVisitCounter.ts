import { useEffect, useState } from 'react';

export const useVisitCounter = () => {
  const [visitCount, setVisitCount] = useState<number>(0);

  useEffect(() => {
    // Get current count from localStorage
    const currentCount = parseInt(localStorage.getItem('grooovio_visits') || '0');
    const newCount = currentCount + 1;
    
    // Update localStorage
    localStorage.setItem('grooovio_visits', newCount.toString());
    
    // Update state
    setVisitCount(newCount);
  }, []);

  return visitCount;
};
