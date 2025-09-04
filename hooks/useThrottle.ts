/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useThrottle.ts

import { useCallback, useRef } from "react";

export const useThrottle = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  );
};
