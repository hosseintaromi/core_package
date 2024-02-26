import { useState } from "react";
import { IObservable } from "src/utils/observable";
import { useFn } from "./useFn";
import { useInit } from "./useInit";

export const useObserver = <T>(
  observable: IObservable<T>,
  subject: T,
  deleted?: (subject: T) => void,
  updated?: (subject: T) => void,
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

  useInit(() => {
    observable.on(subscribe, subject);

    return () => {
      observable.off(subscribe, subject);
    };
  });

  return subjectState;
};
