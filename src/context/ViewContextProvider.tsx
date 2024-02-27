import { ReactNode, useEffect, useRef, createContext, memo } from "react";
import { closeView, openView, removeContainer } from "utils";
import {
  ViewEventType,
  ViewEvents,
  ViewInfo,
  ViewEventArg,
  ViewContextType,
  ViewType,
  CloseType,
} from "types";

export const ViewContext = createContext<ViewContextType>({} as any);

export const ViewContextProvider = memo(
  ({ children, viewInfo }: { children: ReactNode; viewInfo: ViewInfo }) => {
    const eventListeners = useRef<any>({});

    const addEvent = (
      type: ViewEventType,
      event?: (e: ViewEventArg) => void,
    ) => {
      if (!event) {
        return;
      }
      let listener: any[] = eventListeners.current[type];
      if (!listener) {
        listener = eventListeners.current[type] = [];
      }
      listener.push(event);
    };

    const removeEvent = (
      type: ViewEventType,
      event?: (e: ViewEventArg) => void,
    ) => {
      if (!event) {
        return;
      }
      let listener: any[] = eventListeners.current[type];
      listener.remove((x) => x === event);
    };

    const listenEvents = (events: ViewEvents) => {
      addEvent(ViewEventType.onEnter, events.onEnter);
      addEvent(ViewEventType.onLeave, events.onLeave);
      addEvent(ViewEventType.onClosing, events.onClosing);
      return () => {
        removeEvent(ViewEventType.onEnter, events.onEnter);
        removeEvent(ViewEventType.onLeave, events.onLeave);
        removeEvent(ViewEventType.onClosing, events.onClosing);
      };
    };

    const emitEvent = (type: ViewEventType, e: ViewEventArg) => {
      const listeners: ((e: ViewEventArg) => void)[] =
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
          emitEvent(ViewEventType.onEnter, e);
        },
        onLeave: (e: ViewEventArg) => {
          emitEvent(ViewEventType.onLeave, e);
        },
        onClosing: (e: ViewEventArg) => {
          emitEvent(ViewEventType.onClosing, e);
        },
      };
      return () => {
        removeContainer(viewInfo.view.type);
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
