import { useRef } from "react";
import { useInit } from "./useInit";

type GenericEventFn = (data?: any) => void;

export type GenericEvents<T extends Record<keyof T, string>> = {
  [eventName in keyof T]?: GenericEventFn;
};

export const useContextEvents = <Y extends Record<string, string>, T = any>(
  context: React.Context<T>,
) => {
  const listenersRef = useRef<{
    [key in keyof Y]: GenericEventFn[];
  }>({} as any);
  const eventContext: any = context;
  if (!eventContext.__listeners) {
    eventContext.__listeners = {};
    eventContext.__events = {};
  }

  const bindCall = (event: Extract<keyof Y, string>) => {
    const __listeners = eventContext.__listeners;
    eventContext.__events[event] = (data?: any) => {
      (__listeners[event] || []).forEach((listener: any) => {
        listener?.(data);
      });
    };
  };

  const listen = (events?: GenericEvents<Y>) => {
    if (!events) {
      return;
    }
    const __listeners = eventContext.__listeners;

    for (let eventName in events) {
      if (!__listeners[eventName]) {
        bindCall(eventName);
        __listeners[eventName] = [];
      }
      __listeners[eventName].push(events[eventName]);
      let listeners: GenericEventFn[] = listenersRef.current[eventName];
      if (!listeners) {
        listeners = listenersRef.current[eventName] = [];
      }
      listeners.push(events[eventName]!);
    }
  };

  useInit(() => () => {
    const __listeners = eventContext.__listeners;
    const localListeners = listenersRef.current;
    for (let key in localListeners) {
      const items: GenericEventFn[] = localListeners[key];
      items.forEach((event: GenericEventFn) => {
        const index = __listeners[key].findIndex(
          (x: GenericEventFn) => x === event,
        );
        __listeners[key].splice(index, 1);
      });
    }
  });

  return {
    listen,
    call: eventContext.__events as GenericEvents<Y>,
  };
};

export default useContextEvents;
