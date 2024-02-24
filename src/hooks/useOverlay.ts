import { MutableRefObject, useRef } from "react";
import { closeView, openView } from "utils";
import { OverlayPositionType } from "types";
import { EventType, useEvent } from "./useEvent";

export interface OverlayData<T, U> {
  event?: EventType;
  component: (props?: any) => JSX.Element;
  data?: T;
  backdrop?: boolean;
  className?: string;
  position?: OverlayPositionType;
  gap?: number;
  positionType?: "ByEvent" | "ByElement";
  getTargetElement?: () => HTMLElement;
  onClose?: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
}

export interface OverlayConfig<T, U> {
  event: EventType;
  component: (props?: any) => JSX.Element;
  backdrop?: boolean;
  className?: string;
  positionType?: "ByEvent" | "ByElement";
  position?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
  onClose: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
}

export const useOverlay = <T, U>(overlayData: OverlayData<T, U>) => {
  const isOpenRef = useRef<boolean>();
  const viewId = "overlay";
  const elRef: MutableRefObject<HTMLElement | { toggle: (e: Event) => void }> =
    {
      current: {
        toggle: (e?: Event) => {
          if (!e && isOpenRef.current) {
            isOpenRef.current = false;
            closeView(viewId, "Overlay");
          } else if (isOpenRef.current) {
            isOpenRef.current = false;
            closeView(viewId, "Overlay");
          } else {
            isOpenRef.current = true;
            if (e) {
              // eslint-disable-next-line no-use-before-define
              openMenu(e);
            }
          }
        },
      },
    };

  const openMenu = (event: Event | TouchEvent) => {
    openView<T>({
      id: viewId,
      type: "Overlay",
      component: overlayData.component,
      data: overlayData.mapDataTo
        ? overlayData.mapDataTo(overlayData.data)
        : overlayData.data,
      onClosed: (res?: U) => {
        isOpenRef.current = false;
        overlayData.onClose?.(res);
      },
      options: {
        disableBackdrop: !!(overlayData.backdrop === undefined || true),
        params: {
          event,
          target:
            overlayData.getTargetElement?.() ||
            (elRef.current && !(elRef.current as any).toggle)
              ? elRef.current
              : event.currentTarget,
          position: overlayData.position ? overlayData.position : "BottomRight",
          gap: overlayData.gap ? overlayData.gap : 0,
        },
      },
    });
  };

  useEvent(
    overlayData.event ? (elRef as MutableRefObject<any>) : undefined,
    overlayData.event || EventType.Tap,
    {
      onPress: (e: Event) => openMenu(e),
      onTap: (e: Event) => openMenu(e),
      onDoubleClick: (e: Event) => openMenu(e),
      onRightClick: (e: Event) => openMenu(e),
      onMouseover: (e: Event) => {
        openMenu(e);
      },
    },
  );

  return elRef as MutableRefObject<any>;
};
