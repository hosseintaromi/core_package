import { useInit } from "./useInit";
import { listenOnChangeView } from "../utils";
import { ViewType } from "../@types";

export const useChangeView = (
  containerType: string,
  onChange: (view: ViewType<any>) => void,
) => {
  useInit(() => {
    const unlisten = listenOnChangeView(containerType, onChange);
    return () => {
      unlisten();
    };
  });
};
