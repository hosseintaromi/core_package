import { Fragment } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks";
import { ViewEvent } from "../../@types";
import { ViewComponent } from "../index";

export const DesktopMainContainer = () => {
  const { viewsInfo } = useViewManage(
    "MasterMiddle",
    0,
    { moveBetweenViews: true },
    {
      duration: 0,
      start(newViewEl, prevViewEl) {
        const newElStyle = newViewEl.ref.style;
        newElStyle.display = "block";
        newElStyle.opacity = "1";
        const prevElStyle = prevViewEl?.ref.style;
        if (prevElStyle) {
          prevElStyle.opacity = "0";
        }
        const prevViewStyle = prevViewEl?.ref.style;
        if (prevViewStyle) {
          prevViewStyle.display = "none";
        }
      },
    } as ViewEvent,
    {},
    {
      duration: 0,
      start(newViewEl, prevViewEl) {
        const newElStyle = newViewEl.ref.style;
        newElStyle.display = "block";
        newElStyle.opacity = "1";
        const prevElStyle = prevViewEl?.ref.style;
        if (prevElStyle) {
          prevElStyle.opacity = "0";
        }
        const prevViewStyle = prevViewEl?.ref.style;
        if (prevViewStyle) {
          prevViewStyle.display = "none";
        }
      },
    } as ViewEvent,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className="master-middle-container">
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
