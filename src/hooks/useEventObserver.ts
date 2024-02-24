import { useState } from "react";
import { IEventObservable } from "src/utils/observable";
import { useFn } from "./useFn";
import { useInit } from "./useInit";

export const useEventObserver = <T, U>(
  observable: IEventObservable<T, U>,
  subject: T,
  deleted?: (subject: T) => void,
  updated?: (subject: T) => void,
  on?: (event: U) => void,
) => {
  const [subjectState, setSubjectState] = useState<T>(subject);

  const subscribe = useFn((action: string, changedSubject: T) => {
    switch (action) {
      case "Update":
        setSubjectState(changedSubject);
        updated?.(changedSubject);
        break;
      case "Delete":
        deleted?.(changedSubject);
        break;
    }
  });

  const eventSubscribe = useFn((action: U) => on?.(action as U));

  useInit(() => {
    observable.on(subscribe, subject);
    observable.eventOn(eventSubscribe, subject);

    return () => {
      observable.off(subscribe, subject);
      observable.eventOff(eventSubscribe, subject);
    };
  });

  return subjectState;
};
