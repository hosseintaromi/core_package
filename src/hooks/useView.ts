import { useContext } from "react";
import { ViewContext } from "../context/ViewContextProvider";
import type { CloseType, ViewEvents, ViewType } from "../@types";
import { useInit } from "./useInit";

export const useView = <T = any>(events?: ViewEvents) => {
  const viewContext = useContext(ViewContext);

  useInit(() => {
    if (events) {
      const unListener = viewContext.listenEvents(events);
      return () => {
        unListener();
      };
    }
  });

  const closeByType = (closeType: CloseType, res?: any) => {
    viewContext.close?.(closeType, res);
  };

  const close = (res?: any) => {
    closeByType("Current", res);
  };

  const openView = (view: Omit<ViewType<T>, "type">) => {
    viewContext.openView?.(view);
  };

  return {
    close,
    closeByType,
    openView,
    viewData: viewContext.getViewData() as T,
  };
};
