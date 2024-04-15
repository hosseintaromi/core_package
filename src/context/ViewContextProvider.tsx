import { ReactNode, useEffect, useRef, createContext, memo } from "react";
import { closeView, openView } from "../utils";
import {
  ViewEventTypeEnum,
  ViewEvents,
  ViewInfo,
  ViewEventArg,
  ViewContextType,
  ViewType,
  CloseType,
  ViewUpdateEventArg,
  ViewEventType,
} from "../@types";

export const ViewContext = createContext<ViewContextType>({} as any);

export const ViewContextProvider = memo(
  ({ children, viewInfo }: { children: ReactNode; viewInfo: ViewInfo }) => {
    const eventListeners = useRef<any>({});

    const addEvent = (type: ViewEventTypeEnum, event?: ViewEventType) => {
      if (!event) {
        return;
      }
      let listener: any[] = eventListeners.current[type];
      if (!listener) {
        listener = eventListeners.current[type] = [];
      }
      listener.push(event);
    };

    const removeEvent = (type: ViewEventTypeEnum, event?: ViewEventType) => {
      if (!event) {
        return;
      }
      let listener: any[] = eventListeners.current[type];
      listener.remove((x) => x === event);
    };

    const listenEvents = (events: ViewEvents) => {
      addEvent(ViewEventTypeEnum.onEnter, events.onEnter);
      addEvent(ViewEventTypeEnum.onLeave, events.onLeave);
      addEvent(ViewEventTypeEnum.onClosing, events.onClosing);
      addEvent(ViewEventTypeEnum.onUpdate, events.onUpdate);
      return () => {
        removeEvent(ViewEventTypeEnum.onEnter, events.onEnter);
        removeEvent(ViewEventTypeEnum.onLeave, events.onLeave);
        removeEvent(ViewEventTypeEnum.onClosing, events.onClosing);
        removeEvent(ViewEventTypeEnum.onUpdate, events.onUpdate);
      };
    };

    const emitEvent = (
      type: ViewEventTypeEnum,
      e: ViewEventArg | ViewUpdateEventArg,
    ) => {
      const listeners: ((e: ViewEventArg | ViewUpdateEventArg) => void)[] =
        eventListeners.current[type];
      listeners?.forEach((listener) => {
        listener(e);
      });
    };

    const getViewData = () => viewInfo.view.data;

    const close = (closeType: CloseType, res?: any) => {
      const view = viewInfo.view;
      closeView(view.id, view.type, closeType, res);
    };

    const open = (view: ViewType<any>) => {
      view.type = viewInfo.view.type;
      openView(view);
    };

    useEffect(() => {
      viewInfo.events = {
        onEnter: (e: ViewEventArg) => {
          emitEvent(ViewEventTypeEnum.onEnter, e);
        },
        onLeave: (e: ViewEventArg) => {
          emitEvent(ViewEventTypeEnum.onLeave, e);
        },
        onClosing: (e: ViewEventArg) => {
          emitEvent(ViewEventTypeEnum.onClosing, e);
        },
        onUpdate: (e: ViewUpdateEventArg) => {
          emitEvent(ViewEventTypeEnum.onUpdate, e);
        },
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <ViewContext.Provider
        value={{
          listenEvents,
          emitEvent,
          close,
          getViewData,
          openView: open as any,
        }}
      >
        {children}
      </ViewContext.Provider>
    );
  },
  () => process.env.NODE_ENV === "production",
);
