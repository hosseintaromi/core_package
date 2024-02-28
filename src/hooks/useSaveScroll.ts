import { useRef, useEffect, RefObject } from "react";
import { getRefValue } from "utils";

export type UseSaveScrollType = {
  key: string | number;
  containerRef: RefObject<HTMLElement>;
};

const scrollReference: Record<number | string, number> = {};

export const useSaveScroll = ({ containerRef, key }: UseSaveScrollType) => {
  const scrollAmountRef = useRef(0);

  const getRowScroll = () => scrollReference?.[key];
  const setRowScroll = (value: number) => {
    scrollReference[key] = value;
  };

  useEffect(() => {
    const scrollAmount = getRowScroll();
    const containerRefValue = getRefValue(containerRef);
    if (!containerRefValue) {
      return;
    }

    if (scrollAmount) {
      containerRefValue.scrollTo({
        left: scrollAmount,
      });
    }

    const handleScroll = () => {
      scrollAmountRef.current = containerRefValue?.scrollLeft;
    };

    containerRefValue.addEventListener("scroll", handleScroll);

    return () => {
      const lastScrollAmount = getRefValue(scrollAmountRef) || 0;
      setRowScroll(lastScrollAmount);

      containerRefValue.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
