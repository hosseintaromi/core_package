import { useRef, useState } from "react";
import {
  ChangeContainerEventType,
  CloseType,
  ViewEvent,
  ViewContainerConfig,
  ViewInfo,
  ViewRef,
  ViewType,
  ViewEventConfigBase,
  ViewEventConfigClose,
} from "types";
import {
  registerContainer,
  removeContainer,
  updateViewsByCloseType,
} from "utils";
import { useAnimate } from "./useAnimate";
import { useInit } from "./useInit";
import { useFn } from "./useFn";

export const useViewManage = (
  type: string,
  containerOrder: number,
  config?: ViewContainerConfig,
  openConfig?: ViewEvent,
  closeConfig?: ViewEvent,
  activateConfig?: ViewEvent,
  onEnterContainerConfig?: ViewEvent,
  onLeaveContainerConfig?: ViewEvent,
) => {
  const [viewsInfo, setViewsInfo] = useState<ViewInfo[]>([]);
  const activeViewIdRef = useRef<string>("");
  const initRef = useRef<boolean>(false);
  const { requestAnimate } = useAnimate();

  const handleViewEvent = useFn(
    <T extends ViewEventConfigBase>(
      newView: ViewRef,
      prevView?: ViewRef,
      event?: ViewEvent,
      config?: T,
    ) =>
      new Promise<any>((resolve, reject) => {
        if (!event) {
          resolve(true);
        }
        event?.start?.(newView, prevView, config);
        if (config?.disableAnimate || !event?.duration) {
          event?.animate?.(1, newView, prevView, config);
          event?.end?.(newView, prevView, config);
          resolve(true);
          return;
        }
        document.body.classList.add("animating");
        requestAnimate(
          event.duration,
          (t: number) => {
            event?.animate?.(t, newView, prevView, config);
          },
          () => {
            event?.end?.(newView, prevView, config);
            document.body.classList.remove("animating");
            resolve(true);
          },
        );
      }),
  );

  const openView = useFn(
    (newView: ViewType<any>) =>
      new Promise((resolve, reject) => {
        const newPgeInfo: ViewInfo = {
          id: newView.id,
          view: newView,
          onInit: async (el: HTMLElement) => {
            const currentViewInfo = viewsInfo.find(
              (x) => x.id === activeViewIdRef.current,
            );
            activeViewIdRef.current = newView.id;
            const options = newView.options;
            let disableAnimate = options?.disableAnimate;
            if (!disableAnimate && !initRef.current) {
              initRef.current = true;
              disableAnimate = config?.disableFirstTimeAnimate || false;
            }
            if (options?.inBackground) {
              el.style.display = "none";
              resolve(true);
              return;
            }
            await handleViewEvent(
              {
                view: newView,
                ref: newPgeInfo.elRef as any,
              },
              currentViewInfo
                ? {
                    view: currentViewInfo?.view,
                    ref: currentViewInfo?.elRef as any,
                  }
                : undefined,
              openConfig,
              { disableAnimate: disableAnimate },
            );
            if (currentViewInfo) {
              currentViewInfo.events?.onLeave?.({
                toView: newView,
              });
            }
            newPgeInfo.events?.onEnter?.({
              fromView: currentViewInfo?.view,
              data: newView.data,
            });
            resolve(true);
          },
        };
        viewsInfo.push(newPgeInfo);
        setViewsInfo([...viewsInfo]);
      }),
  );

  const closeView = useFn(
    async (
      view: ViewType<any>,
      newActiveView: ViewType<any> | undefined,
      closeType: CloseType,
    ) => {
      let activeViewInfo: ViewInfo | undefined;
      activeViewIdRef.current = "";
      if (newActiveView) {
        activeViewIdRef.current = newActiveView.id;
        activeViewInfo = viewsInfo.find((x) => x.id === newActiveView.id);
      }

      const index = viewsInfo.findIndex((x) => x.id === view.id);
      if (index < 0) {
        return;
      }

      const closeViewInfo = viewsInfo[index];
      const disableAnimate =
        !config?.moveBetweenViews && index < viewsInfo.length - 1;
      closeViewInfo.events?.onClosing?.({
        toView: newActiveView,
      });

      await handleViewEvent<ViewEventConfigClose>(
        {
          view: viewsInfo[index].view,
          ref: viewsInfo[index].elRef as any,
        },
        activeViewInfo
          ? {
              view: activeViewInfo.view,
              ref: activeViewInfo.elRef as any,
            }
          : undefined,
        closeConfig,
        { disableAnimate: disableAnimate, closeType },
      );

      if (activeViewInfo) {
        activeViewInfo.events?.onEnter?.({
          fromView: closeViewInfo.view,
        });
      }

      if (index > -1) {
        updateViewsByCloseType(viewsInfo, closeType, index);
        setViewsInfo([...viewsInfo]);
      }
    },
  );

  const activateView = useFn(async (view: ViewType<any>) => {
    const viewInfo = viewsInfo.find((x) => x.id === view.id);
    if (!viewInfo) {
      return;
    }
    if (activeViewIdRef.current === view.id) {
      return;
    }
    const currentViewInfo = viewsInfo.find(
      (x) => x.id === activeViewIdRef.current,
    );
    activeViewIdRef.current = view.id;
    await handleViewEvent(
      {
        view: viewInfo.view,
        ref: viewInfo.elRef as any,
      },
      currentViewInfo
        ? {
            view: currentViewInfo.view,
            ref: currentViewInfo.elRef as any,
          }
        : undefined,
      activateConfig,
    );
    if (currentViewInfo) {
      currentViewInfo.events?.onLeave?.({
        toView: view,
      });
    }
    viewInfo.events?.onEnter?.({
      fromView: currentViewInfo?.view,
    });
  });

  const changeContainer = useFn(
    async (fromView: ViewType<any>, eventType: ChangeContainerEventType) => {
      const activeViewInfo = viewsInfo.find(
        (x) => x.id === activeViewIdRef.current,
      );

      if (!activeViewInfo) {
        return;
      }
      await handleViewEvent(
        {
          view: activeViewInfo.view,
          ref: activeViewInfo.elRef as any,
        },
        {
          view: fromView,
          ref: null as any,
        },
        eventType === ChangeContainerEventType.onEnter
          ? onEnterContainerConfig
          : onLeaveContainerConfig,
      );
      if (eventType === ChangeContainerEventType.onEnter) {
        activeViewInfo.events?.onEnter?.({
          fromView: fromView,
        });
      } else if (eventType === ChangeContainerEventType.onLeave) {
        activeViewInfo.events?.onLeave?.({
          toView: fromView,
        });
      }
    },
  );

  useInit(() => {
    registerContainer(
      type,
      containerOrder,
      config || {},
      openView,
      closeView,
      activateView,
      changeContainer,
    );
    return () => {
      removeContainer(type);
    };
  });

  return {
    activeViewId: activeViewIdRef.current,
    viewsInfo,
    openView,
    closeView,
  };
};
