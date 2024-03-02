import { useRef, RefObject } from "react";
import { useInit } from "./useInit";

export type UseIntersectionObserverType<T = any> = {
  ref: RefObject<T>;
  enterViewCallback: () => void;
  exitViewCallback?: () => void;
  shouldUnObserve?: boolean;
  options?: IntersectionObserverInit;
};

const listenerCallbacksList = new WeakMap<
  Element,
  {
    observerKey: string;
    enterViewCallback: () => void;
    shouldUnObserve: boolean;
    exitViewCallback?: () => void;
  }
>();

let observer: {
  [key: string]: IntersectionObserver;
} = {};

const initialObserverOptions: IntersectionObserverInit = {
  rootMargin: "0px",
  threshold: 0.15,
};

const handleIntersections: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (
      listenerCallbacksList.has(entry.target) &&
      entry.intersectionRatio > 0
    ) {
      const listener = listenerCallbacksList.get(entry.target);
      if (entry.isIntersecting) {
        if (listener?.shouldUnObserve) {
          observer[listener.observerKey]?.unobserve(entry.target);
          listenerCallbacksList.delete(entry.target);
        }
        if (listener?.enterViewCallback) {
          listener.enterViewCallback();
        }
      } else {
        if (listener?.exitViewCallback) {
          listener.exitViewCallback();
        }
      }
    }
  });
};

const getIntersectionObserver = (
  observerKey: string,
  options: IntersectionObserverInit,
) => {
  if (!observer[observerKey]) {
    observer[observerKey] = new IntersectionObserver(
      handleIntersections,
      options,
    );
  }
  return observer[observerKey];
};

export const useIntersectionObserver = ({
  ref,
  enterViewCallback,
  exitViewCallback,
  shouldUnObserve = true,
  options,
}: UseIntersectionObserverType) => {
  const isInViewRef = useRef(false);
  useInit(() => {
    if (!ref.current) {
      return;
    }
    const element = ref.current;
    const observerKey = `key-${
      options?.threshold || initialObserverOptions.threshold
    }`;
    const observerInstance = getIntersectionObserver(
      observerKey,
      options || initialObserverOptions,
    );
    listenerCallbacksList.set(element, {
      observerKey,
      enterViewCallback: () => {
        isInViewRef.current = true;
        enterViewCallback();
      },
      exitViewCallback: () => {
        isInViewRef.current = false;
        if (exitViewCallback) {
          exitViewCallback();
        }
      },
      shouldUnObserve,
    });
    observerInstance.observe(element);

    return () => {
      listenerCallbacksList.delete(element);
      observerInstance.unobserve(element);
    };
  });
  const isInView = () => isInViewRef.current;
  return { isInView };
};
