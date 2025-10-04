import { useEffect, useRef } from 'react';

const useIdleTimeout = (onIdle, timeout = 900000) => { // Default timeout is 15 minutes
  const timeoutId = useRef();
  const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

  const startTimer = () => {
    timeoutId.current = setTimeout(onIdle, timeout);
  };

  const resetTimer = () => {
    clearTimeout(timeoutId.current);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);
};

export default useIdleTimeout;