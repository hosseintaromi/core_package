import { Fragment, useRef } from "react";
import { bezier, closeView } from "../../utils";
import { useViewManage } from "../../hooks";
import { ViewEvent, ViewContainerType } from "../../@types";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { ViewComponent } from "../index";

export const ModalContainer = () => {
  const slideIn = bezier(0.25, 1, 0.5, 1);
  const backDropRef = useRef<any>(null);

  const { viewsInfo } = useViewManage(
    ViewContainerType.Modal,
    4,
    {},
    {
      duration: 300,
      start(newView, prevView) {
        const newViewStyle = newView.ref.style;
        newViewStyle.display = "block";
        newViewStyle.opacity = "0";
        newViewStyle.marginTop = `${-newView.ref.offsetHeight / 2}px`;
        const length = viewsInfo.length;
        newViewStyle.zIndex = `${1000 + length + 1}`;
        newViewStyle.transform = "translateY(20%)";

        if (prevView?.ref) {
          prevView.ref.style.zIndex = `${1000 + length - 1}`;
        }
        backDropRef.current.style.zIndex = `${1000 + length}`;
      },
      animate(t, newView) {
        const p = slideIn(t);
        const newViewStyle = newView.ref.style;
        if (viewsInfo.length === 1) {
          backDropRef.current.style.opacity = `${p}`;
        }
        newViewStyle.opacity = `${p}`;
        newViewStyle.transform = `translateY(${20 - p * 20}%)`;
      },
      end() {},
    } as ViewEvent,
    {
      duration: 300,
      start(closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        const activeViewStyle = activeViewEl?.ref.style;
        if (activeViewStyle) {
          activeViewStyle.opacity = "0";
          activeViewStyle.zIndex = `${1000 + viewsInfo.length + 1}`;
        }
        closedViewStyle.opacity = "1";
      },
      animate(t, closeViewEl, activeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        const activeViewStyle = activeViewEl?.ref.style;
        const p = slideIn(t);

        closedViewStyle.opacity = `${1 - p}`;
        closedViewStyle.transform = `translateY(${p * 20}%)`;
        if (viewsInfo.length === 1) {
          backDropRef.current.style.opacity = `${1 - p}`;
        }

        if (activeViewStyle) {
          activeViewStyle.opacity = `${p}`;
        }
      },
      end(closeViewEl) {
        const closedViewStyle = closeViewEl.ref.style;
        closedViewStyle.display = "none";
        backDropRef.current.style.zIndex = (1000 + viewsInfo.length).toString();
      },
    } as ViewEvent,
  );

  const closeModal = () => {
    if (viewsInfo.length === 0) {
      return;
    }
    const topViewInfo = viewsInfo.last();
    const view = topViewInfo.view;
    if (view.options?.disableBackdrop) {
      view.options.onClickedBackdrop?.();
      return;
    }
    closeView(view.id, view.type);
  };

  return (
    <div className={viewsInfo.length === 0 ? "hidden" : "modal-container"}>
      <div
        ref={backDropRef}
        onClick={closeModal}
        className={viewsInfo.length === 0 ? "" : "modal-backdrop"}
      />
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
