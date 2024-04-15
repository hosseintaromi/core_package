import { Fragment, useRef } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useInit, useViewManage } from "../../hooks";
import { setStyle, bezier, closeView } from "../../utils";
import { OverlayPositionType, ViewEvent } from "../../@types";
import { ViewComponent } from "../index";

interface OverlayParamsType {
  target: HTMLElement;
  event: MouseEvent;
  position: OverlayPositionType;
  gap?: number;
}

export const OverlayContainer = () => {
  const slideIn = bezier(0.25, 1, 0.5, 1);

  const backDropRef = useRef<any>(null);
  const setPositionRef = useRef<any>();

  const setPosition = (
    targetEl: HTMLElement,
    overlayEl: HTMLElement,
    position: OverlayPositionType,
    gap: number = 0,
  ) => {
    const rects: any = targetEl.getBoundingClientRect();
    const width = overlayEl.offsetWidth;
    const height = overlayEl.offsetHeight;
    const css = (left: number, top: number) => {
      setStyle(overlayEl, {
        left: `${left}px`,
        top: `${top}px`,
      });
    };
    switch (position) {
      case "TopLeft":
        css(rects.left, rects.top - height - gap);
        break;
      case "TopRight":
        css(rects.left + rects.width - width, rects.top - height - gap);
        break;
      case "TopCenter":
        css(rects.left + rects.width / 2 - width / 2, rects.top - height - gap);
        break;
      case "BottomLeft":
        css(rects.left, rects.top + rects.height + gap);
        break;
      case "BottomRight":
        css(rects.left + rects.width - width, rects.top + rects.height + gap);
        break;
      case "BottomCenter":
        css(
          rects.left + rects.width / 2 - width / 2,
          rects.top + rects.height + gap,
        );
        break;
    }
  };

  const clearListeners = () => {
    const setPos = setPositionRef.current;
    if (setPos) {
      // eslint-disable-next-line no-restricted-globals
      removeEventListener("scroll", setPos);
      // eslint-disable-next-line no-restricted-globals
      removeEventListener("resize", setPos);
      setPositionRef.current = null;
    }
  };

  const { viewsInfo } = useViewManage(
    "Overlay",
    6,
    {},
    {
      duration: 500,
      start(newView) {
        const params: OverlayParamsType = newView.view.options?.params;
        if (params.target) {
          params.target.classList?.add("is-open");
        }
        const newViewEl = newView.ref;
        setStyle(newViewEl, {
          position: "absolute",
          opacity: "0",
        });

        const setPos = (setPositionRef.current = () => {
          setPosition(params.target, newViewEl, params.position, params.gap);
        });
        clearListeners();
        // eslint-disable-next-line no-restricted-globals
        addEventListener("scroll", setPos);
        // eslint-disable-next-line no-restricted-globals
        addEventListener("resize", setPos);
        setPos();
        setStyle(newViewEl, {
          position: "fixed",
        });
        setStyle(backDropRef.current, {
          display: "block",
          opacity: "0",
        });
      },
      animate(t, newView) {
        const options = newView?.view.options;
        const newViewStyle = newView.ref.style;
        const p = slideIn(t);
        newViewStyle.opacity = `${p}`;
        if (!options?.disableBackdrop) {
          setStyle(backDropRef.current, {
            opacity: `${p}`,
          });
        }
      },
    } as ViewEvent,
    {
      duration: 0,
      start(closeView) {
        clearListeners();
        const { target }: OverlayParamsType = closeView.view.options?.params;
        if (target?.classList) {
          target.classList.remove("is-open");
        }
        setStyle(backDropRef.current, {
          display: "none",
        });
      },
    } as ViewEvent,
  );

  const closeModal = () => {
    if (viewsInfo.length > 0) {
      const view = viewsInfo[0].view;
      closeView(view.id, view.type);
    }
  };

  useInit(() => {
    setStyle(backDropRef.current, {
      inset: "0",
      position: "absolute",
      display: "none",
      zIndex: "1",
    });
  });

  return (
    <div className={viewsInfo.length === 0 ? "hidden" : "overlay-container"}>
      <div ref={backDropRef} onClick={closeModal} className="backdrop" />
      {viewsInfo?.map((viewInfo) => (
        <Fragment key={viewInfo.id}>
          <ViewContextProvider viewInfo={viewInfo}>
            <ViewComponent viewInfo={viewInfo} />
          </ViewContextProvider>
        </Fragment>
      ))}
    </div>
  );
};
