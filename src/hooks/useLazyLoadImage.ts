import { useRef, RefObject } from "react";
import { useInit } from "./useInit";
import { useIntersectionObserver } from "./useIntersectionObserver";

export type UseLazyLoadImageOptionsType = {
  src: string;
  animate?: boolean;
  intersectionOptions?: IntersectionObserverInit;
};

export type UseLazyLoadImageType<T = any> = {
  ref: RefObject<T>;
  options: UseLazyLoadImageOptionsType;
};

export const useLazyLoadImage = <T extends HTMLElement>({
  ref,
  options,
}: UseLazyLoadImageType<T>) => {
  const timeout = useRef<NodeJS.Timeout | undefined>();

  const load = (image: HTMLImageElement) => {
    ref.current?.append(image);
    if (options.animate) {
      image.classList.add("image-loaded");
    }
  };
  useIntersectionObserver({
    ref,
    enterViewCallback: () => {
      let image = new Image();
      image.src = options.src;
      image.draggable = false;
      image.onload = () => {
        if (image.width > 1200) {
          timeout.current = setTimeout(() => {
            load(image);
          }, 500);
        } else {
          load(image);
        }
      };
    },
    ...(options.intersectionOptions && {
      options: options.intersectionOptions,
    }),
  });

  useInit(() => () => {
    if (timeout) {
      clearTimeout(timeout.current);
    }
  });
};
