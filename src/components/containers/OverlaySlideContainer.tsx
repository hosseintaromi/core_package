import React, { MutableRefObject, useRef } from "react";
import { ViewContextProvider } from "context/ViewContextProvider";
import { EventType, useEvent, useFn, useViewManage } from "hooks";
import { bezier, closeView, openView } from "utils";
import { ViewEvent, ViewEventConfigClose } from "types";
import { ViewComponent } from "../_index";

export interface OverlayInlineData<T, U> {
  id?: string;
  event: EventType;
  elRef?: MutableRefObject<HTMLElement>;
  data?: T;
  className?: string;
  component: (props?: any) => JSX.Element;
  onClose?: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
  show?: (show: boolean) => void;
}

export const OverlaySlideContainer = <T, U>({
  config,
}: {
  config: OverlayInlineData<T, U>;
}) => {
  const slideIn = bezier(0.25, 1, 0.5, 1);
  const containerRef = useRef<any>(null);
  const doingRef = useRef<boolean>(false);
  const hoverTimerRef = useRef<NodeJS.Timeout>();
  const isHoverRef = useRef<boolean>();
  const containerType = "overlay-inline-" + Date.now();
  let heightDef = 0;

  const setContainerHeight = (height: number) => {
    containerRef.current.style.height = height + "px";
  };

  const setContainerOpacity = (opacity: number) => {
    containerRef.current.style.opacity = opacity;
  };

  const { viewsInfo } = useViewManage(
    containerType,
    6,
    {},
    {
      duration: 300,
      start(newView, prevView) {
        const newEl = newView.ref;
        const prevEl = prevView?.ref;
        heightDef = prevEl ? newEl.clientHeight - prevEl.clientHeight : 0;
        setContainerHeight(newEl.clientHeight);

        if (prevEl) {
          newEl.style.transform = `translateX(${100}%)`;
        } else {
          newEl.style.opacity = "0";
        }
      },
      animate(t, newView, prevView) {
        const p = slideIn(t);
        const prevElStyle = prevView?.ref.style;
        const newElStyle = newView.ref.style;
        const prevElHeight = prevView?.ref.offsetHeight || 0;

        if (prevElStyle) {
          setContainerHeight(prevElHeight + heightDef * p);
          prevElStyle.transform = `translateX(${-p * 100}%)`;
          prevElStyle.opacity = `${1 - p}`;
          newElStyle.transform = `translateX(${(1 - p) * 100}%)`;
          newElStyle.opacity = `${p}`;
        } else {
          setContainerOpacity(p);
          newElStyle.opacity = `${p}`;
        }
      },
      end(newView, prevView) {},
    } as ViewEvent,
    {
      duration: 300,
      start(closeViewEl, activeViewEl) {
        heightDef = activeViewEl
          ? activeViewEl.ref.clientHeight - closeViewEl.ref.clientHeight
          : 0;
      },
      animate(t, closeViewEl, activeViewEl, config) {
        const p = slideIn(t);
        const prevViewHeight = closeViewEl.ref.offsetHeight;
        const newViewStyle = activeViewEl?.ref.style;
        const prevViewStyle = closeViewEl.ref.style;
        if (newViewStyle && config?.closeType === "Current") {
          setContainerHeight(prevViewHeight + heightDef * p);
          prevViewStyle.transform = `translateX(${p * 100}%)`;
          prevViewStyle.opacity = `${1 - p}`;
          newViewStyle.transform = `translateX(${(p - 1) * 100}%)`;
          newViewStyle.opacity = `${p}`;
        } else {
          setContainerOpacity(1 - p);
        }
      },
      end(closeViewEl, activeViewEl) {},
    } as ViewEvent<ViewEventConfigClose>,
  );

  const openConfigView = useFn(async () => {
    try {
      if (doingRef.current) {
        return;
      }
      doingRef.current = true;
      await openView({
        id: config.id,
        type: containerType,
        component: config.component,
        data: config.data,
        className: config.className,
      });
      doingRef.current = false;
    } catch {
      doingRef.current = false;
    }
  });

  const showByHover = useFn((show: boolean) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      if (isHoverRef.current === show) {
        if (show) {
          openConfigView();
        } else {
          const view = viewsInfo[0].view;
          closeView(view.id, view.type);
        }
      }
    }, 300);
  });

  useEvent(config.elRef || { current: undefined }, config.event, {
    onPress: () => openConfigView(),
    onTap: () => openConfigView(),
    onDoubleClick: () => openConfigView(),
    onRightClick: () => openConfigView(),
    onMouseover: () => {
      isHoverRef.current = true;
      showByHover(true);
    },
    onMouseout: () => {
      isHoverRef.current = false;
      showByHover(false);
    },
  });

  useEvent({ current: window as any }, EventType.Tap, {
    onTap: async (e: Event) => {
      if (doingRef.current) {
        return;
      }
      if (viewsInfo.length > 0 && !e.contains(containerRef.current)) {
        const view = viewsInfo[0].view;
        try {
          doingRef.current = true;
          await closeView(view.id, view.type, "All");
          doingRef.current = false;
        } catch {
          doingRef.current = false;
        }
      }
    },
  });

  return (
    <div
      ref={containerRef}
      className={viewsInfo.length === 0 ? "hidden" : "overlay-inline-container"}
    >
      {viewsInfo?.map((viewInfo) => (
        <React.Fragment key={viewInfo.id}>
          <ViewContextProvider viewInfo={viewInfo}>
            <ViewComponent viewInfo={viewInfo} />
          </ViewContextProvider>
        </React.Fragment>
      ))}
    </div>
  );
};
