import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (delay) {
      setIsDebouncing(true);
      timer = setTimeout(() => {
        setDebouncedValue(value);
        setIsDebouncing(false);
      }, delay);
    } else {
      setDebouncedValue(value);
    }

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}

export default useDebounce;
