import { Fragment, useRef } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks";
import { bezier } from "../../utils";
import { ViewComponent } from "../index";

export const DesktopLeftContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { viewsInfo } = useViewManage(
    "MasterProfile",
    0,
    { moveBetweenViews: true, disableFirstTimeAnimate: true },
    {
      duration: 400,
      start(newViewEl, prevViewEl) {
        const containerEl = containerRef.current;
        const newStyle = newViewEl.ref.style;
        let prevStyle = prevViewEl?.ref.style;
        if (containerEl && viewsInfo.length <= 1) {
          containerEl.style.marginLeft = `${-containerEl.offsetWidth}px`;
          containerEl.style.display = "block";
        } else {
          if (prevStyle) {
            prevStyle.position = "absolute";
            prevStyle.top = "0";
            prevStyle.width = "100%";
            prevStyle.zIndex = "1000";
          }
          if (newStyle) {
            newStyle.display = "block";
            newStyle.opacity = "1";
            newStyle.zIndex = "1000";
          }
        }
      },
      animate(t, newViewEl, prevViewEl) {
        const containerEl = containerRef.current;
        const newStyle = newViewEl.ref.style;
        const prevStyle = prevViewEl?.ref.style;
        const p = bezier(0.25, 1, 0.5, 1)(t);
        // eslint-disable-next-line no-use-before-define
        if (containerEl && viewsInfo.length <= 1) {
          containerEl.style.marginLeft = `${
            (p - 1) * containerEl.offsetWidth
          }px`;
          if (prevStyle) {
            prevStyle.transform = `translateX(-${(p - 1) * 0.2 * 100}%)`;
          }
        } else {
          if (prevStyle) {
            prevStyle.transform = `translateX(${p * 100}%)`;
          }
          if (newStyle) {
            newStyle.transform = `translateX(${(p - 1) * 0.2 * 100}%)`;
          }
        }
      },
      end(newViewEl, prevViewEl) {
        const prevStyle = prevViewEl?.ref.style;
        if (prevStyle) {
          prevStyle.display = "none";
        }
      },
    },
    {
      duration: 400,
      start(closeViewEl, activeViewEl) {
        const containerEl = containerRef.current;
        // eslint-disable-next-line no-use-before-define
        if (containerEl && viewsInfo.length <= 1) {
          containerEl.style.display = "block";
        } else {
          const newStyle = activeViewEl?.ref.style;
          const prevStyle = closeViewEl?.ref.style;
          if (newStyle) {
            newStyle.display = "block";
            newStyle.zIndex = "1001";
            newStyle.transform = "translateX(100%)";
          }
          if (prevStyle) {
            prevStyle.zIndex = "1000";
          }
        }
      },
      animate(t, closeViewEl, activeViewEl) {
        const containerEl = containerRef.current;
        const activeStyle = activeViewEl?.ref.style;
        const closeStyle = closeViewEl.ref.style;
        const p = bezier(0.25, 1, 0.5, 1)(t);
        if (containerEl && viewsInfo.length <= 1) {
          containerEl.style.marginLeft = `${-p * containerEl?.offsetWidth}px`;
        } else {
          if (activeStyle) {
            activeStyle.transform = `translateX(${(1 - p) * 100}%)`;
          }
          if (closeStyle) {
            closeStyle.transform = `translateX(${-p * 100 * 0.2}%)`;
          }
        }
      },
      end(closeView, activeView) {
        const containerEl = containerRef.current;
        const activeStyle = activeView?.ref.style;
        const closeStyle = closeView?.ref.style;
        if (activeStyle) {
          activeStyle.opacity = "1";
        }
        if (containerEl && viewsInfo.length <= 1) {
          containerEl.style.display = "none";
        } else {
          if (closeStyle) {
            closeStyle.opacity = "0";
            closeStyle.display = "none";
          }
        }
      },
    },
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div ref={containerRef} className="master-profile-container">
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
