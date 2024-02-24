import { useRef } from "react";
import { useFn } from "./useFn";
import { useInit } from "./useInit";

export const useTimeout = (callback?: () => void, delay?: number) => {
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const clearAll = () => {
    timeoutRef.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeoutRef.current = [];
  };

  const timeout = useFn(
    (callback: () => void, delay?: number, reset?: boolean) => {
      if (reset) {
        clearAll();
      }
      const timeouts = timeoutRef.current;
      const newTimeout = setTimeout(callback, delay || 0);
      timeouts.push(newTimeout);
      return () => {
        clearTimeout(newTimeout);
        timeouts.remove((x) => x === newTimeout);
      };
    },
  );

  useInit(() => {
    if (callback) {
      timeout(callback, delay);
    }
    return () => {
      clearAll();
    };
  });

  return timeout;
};
