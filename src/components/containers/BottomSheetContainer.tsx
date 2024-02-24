import React, { useRef } from "react";
import { ViewContextProvider } from "context/ViewContextProvider";
import { useViewManage } from "hooks";
import { bezier, closeView } from "utils";
import { ViewContainerType, ViewEvent } from "types";
import { activateTabConfig } from "src/utils/viewAnimations";
import { Scrollable, ViewComponent } from "../_index";

export const BottomSheetContainer = () => {
  const slideIn = bezier(0.25, 1, 0.5, 1);
  const backDropRefHook = useRef<any>(null);

  const { viewsInfo } = useViewManage(
    ViewContainerType.BottomSheet,
    3,
    {},
    {
      duration: 300,
      start(newView, prevView) {
        const newViewStyle = newView.ref.style;
        newViewStyle.display = "block";
        newViewStyle.opacity = "0";
        const length = viewsInfo.length;
        newViewStyle.zIndex = `${length + 1}`;
        newViewStyle.transform = "translateY(100%)";

        if (prevView?.ref) {
          prevView.ref.style.zIndex = `${length - 1}`;
        }
        backDropRefHook.current.style.zIndex = `${length}`;
      },
      animate(t, newView, prevView) {
        const p = slideIn(t);
        const newViewStyle = newView.ref.style;
        if (viewsInfo.length === 1) {
          backDropRefHook.current.style.opacity = `${p}`;
        }
        newViewStyle.opacity = `${p}`;
        newViewStyle.transform = `translateY(${100 - p * 100}%)`;
      },
      end(newView, prevView) {},
    } as ViewEvent,
    {
      duration: 300,
      start(closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        const activeViewStyle = activeViewEl?.ref.style;
        if (activeViewStyle) {
          activeViewStyle.opacity = "0";
          activeViewStyle.zIndex = `${viewsInfo.length + 1}`;
        }
        closedViewStyle.opacity = "1";
      },
      animate(t, closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        const activeViewStyle = activeViewEl?.ref.style;
        const p = slideIn(t);

        closedViewStyle.opacity = `${1 - p}`;
        closedViewStyle.transform = `translateY(${p * 100}%)`;
        if (viewsInfo.length === 1) {
          backDropRefHook.current.style.opacity = `${1 - p}`;
        }

        if (activeViewStyle) {
          activeViewStyle.opacity = `${p}`;
        }
      },
      end(closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        closedViewStyle.display = "none";
        backDropRefHook.current.style.zIndex = viewsInfo.length.toString();
      },
    } as ViewEvent,
    activateTabConfig,
    {
      duration: 300,
      animate(t, _closedView, newView) {
        if (newView?.view.type === ViewContainerType.Modal) {
          const p = slideIn(t);
          backDropRefHook.current.style.opacity = `${p}`;
        }
      },
    } as ViewEvent,
    {
      duration: 300,
      animate(t, _closedView, newView) {
        if (newView?.view.type === ViewContainerType.Modal) {
          const p = slideIn(t);
          backDropRefHook.current.style.opacity = `${1 - p}`;
        }
      },
    } as ViewEvent,
  );

  const closeSheet = () => {
    if (viewsInfo.length === 0) {
      return;
    }
    const topViewInfo = viewsInfo.last();
    if (topViewInfo.view.options?.disableBackdrop) {
      topViewInfo.view.options.onClickedBackdrop?.();
      return;
    }
    const view = topViewInfo.view;
    closeView(view.id, view.type);
  };

  return (
    <div className={viewsInfo.length === 0 ? "" : "bottom-sheet-container"}>
      <div
        ref={backDropRefHook}
        onClick={closeSheet}
        className={viewsInfo.length === 0 ? "" : "sheet-backdrop"}
      />
      {viewsInfo?.map((viewInfo) => (
        <React.Fragment key={viewInfo.id}>
          <ViewContextProvider viewInfo={viewInfo}>
            <Scrollable viewInfo={viewInfo}>
              <ViewComponent viewInfo={viewInfo} />
            </Scrollable>
          </ViewContextProvider>
        </React.Fragment>
      ))}
    </div>
  );
};
