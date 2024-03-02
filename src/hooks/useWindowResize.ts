import { useState, useEffect, useRef, RefObject } from "react";

export type UseWindowResizeType<T extends HTMLElement> = RefObject<T> | null;

export type WindowResizeInnerSizeType = {
  width: number;
  height: number;
};

export const useWindowResize = <T extends HTMLElement>(
  containerRef: UseWindowResizeType<T>,
  initialDelay?: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [innerSize, setInnerSize] = useState<WindowResizeInnerSizeType>();
  useEffect(() => {
    const handleResize = () => {
      setInnerSize({
        width: containerRef?.current?.clientWidth || 0,
        height: containerRef?.current?.clientHeight || 0,
      });
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    if (!initialDelay) {
      handleResize();
    } else {
      timeoutRef.current = setTimeout(() => {
        handleResize();
      }, initialDelay);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { innerSize };
};
