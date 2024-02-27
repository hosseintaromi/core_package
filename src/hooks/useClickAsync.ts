import { MutableRefObject, useRef } from "react";
import { useInit } from "./useInit";

export const useClickAsync = <T>(
  asyncRequest: (callback: VoidFunction) => Promise<T> | void,
  success?: (res: T) => void,
  failed?: (exp: string) => void,
) => {
  const loadingRef = useRef<boolean>(false);
  const cssClass = "loading";

  const elRef: MutableRefObject<any | undefined> = { current: undefined };

  const setLoading = (loading: boolean) => {
    const el: HTMLElement = elRef.current;
    loadingRef.current = loading;
    if (loading) {
      el.classList.add(cssClass);
      el.setAttribute("disabled", "");
    } else {
      el.classList.remove(cssClass);
      el.removeAttribute("disabled");
    }
  };

  useInit(() => {
    elRef.current?.addEventListener("click", async () => {
      if (loadingRef.current) {
        return;
      }
      setLoading(true);
      asyncRequest(() => setLoading(false))
        ?.then((res) => success?.(res))
        .catch((exp) => failed?.(exp))
        .finally(() => setLoading(false));
    });
  });

  return elRef;
};
