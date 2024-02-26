import { useState } from "react";
import { IObservable } from "src/utils/observable";
import { useFn } from "./useFn";
import { useInit } from "./useInit";

export const useObserverProp = <T, U extends T[keyof T]>(
  observable: IObservable<T>,
  subject: T,
  getProp: (subject: T) => U,
) => {
  const [propState, setPropState] = useState<U>(getProp(subject));

  const subscribe = useFn((action: string, changedSubject: T) => {
    const newValue = getProp(changedSubject);
    const isObject = typeof newValue === "object";
    switch (action) {
      case "Update":
        if (!isObject && newValue === propState) {
          return;
        }
        setPropState(newValue);
        break;
    }
  });

  useInit(() => {
    observable.on(subscribe, subject);

    return () => {
      observable.off(subscribe, subject);
    };
  });

  return propState;
};
