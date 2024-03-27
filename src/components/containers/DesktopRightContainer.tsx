import { Fragment } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks";
import { bezier } from "../../utils";
import { ViewEvent } from "../../@types";
import { ViewComponent } from "../index";

export const DesktopRightContainer = () => {
  const openConfig: ViewEvent = {
    duration: 300,
    start(newView, prevView) {
      const newStyle = newView.ref.style;
      const prevStyle = prevView?.ref.style;
      newStyle.display = "block";
      newStyle.zIndex = "2";
      newStyle.transform = "translateX(100%)";
      newStyle.position = "absolute";
      newStyle.top = "0";
      newStyle.width = "100%";

      if (prevStyle) {
        prevStyle.zIndex = "1";
      }
    },
    animate(t, newView, prevView) {
      const p = bezier(0.25, 1, 0.5, 1)(t);
      const newStyle = newView.ref.style;
      const prevStyle = prevView?.ref.style;
      newStyle.transform = `translateX(${(1 - p) * 100}%)`;
      if (prevStyle) {
        prevStyle.transform = `translateX(${-p * 100 * 0.2}%)`;
      }
    },
    end(newView, prevView) {
      const prevStyle = prevView?.ref.style;
      if (prevStyle) {
        prevStyle.display = "none";
      }
    },
  };

  const closeConfig: ViewEvent = {
    duration: 300,
    start(closeView, activeView) {
      const closeStyle = closeView.ref.style;
      const activeStyle = activeView?.ref.style;
      closeStyle.position = "absolute";
      // closeStyle.top = "0";
      // closeStyle.width = "100%";
      closeStyle.zIndex = "2";
      if (activeStyle) {
        activeStyle.display = "block";
        activeStyle.opacity = "1";
        activeStyle.zIndex = "1";
      }
    },
    animate(t, closeView, activeView) {
      const closeStyle = closeView.ref.style;
      const activeStyle = activeView?.ref.style;

      const p = bezier(0.25, 1, 0.5, 1)(t);
      closeStyle.transform = `translateX(${p * 100}%)`;
      if (activeStyle) {
        activeStyle.transform = `translateX(${(p - 1) * 0.2 * 100}%)`;
      }
    },
    end(closeView, activeView) {
      const closeStyle = closeView.ref.style;
      const activeStyle = activeView?.ref.style;

      closeStyle.opacity = "0";
      closeStyle.display = "none";
      if (activeStyle) {
        activeStyle.opacity = "1";
      }
    },
  };

  const { viewsInfo } = useViewManage(
    "MasterChat",
    0,
    { moveBetweenViews: true, disableFirstTimeAnimate: true },
    openConfig,
    closeConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className="master-chats-container">
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
