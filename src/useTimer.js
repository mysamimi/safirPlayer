import { useState, useEffect, useRef } from 'react';

export default function useTimer(settings) {
  const { duration, onTick } = settings;

  // tick
  const [tick, setTick] = useState(0);
  function addTick() {
    setTick(prevTick => prevTick + 1);
  }

  // Control function
  const intervalRef = useRef();
  function startTimer() {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (tick >= (duration / 100)) {
          addTick();
          onTick();
        }
      }, 100);
    }
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }

  function resetTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      setTick(0);
    }
  }

  // didMount effect
  useEffect(() =>
    // if (autoStart || expiryTimestamp) {
    //   startTimer();
    // }
    stopTimer,
  []);

  return {
    tick, startTimer, stopTimer, resetTimer,
  };
}
