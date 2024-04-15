import { Fragment } from "react";
import { ViewContainerType } from "../../@types";
import { useViewManage } from "../../hooks";
import {
  onCloseToastConfig,
  onOpenToastConfig,
} from "../../utils/viewAnimations";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { ViewComponent } from "../index";

export const ToastContainer = () => {
  const { viewsInfo } = useViewManage(
    ViewContainerType.Toast,
    5,
    { disableBrowserHistory: true },
    onOpenToastConfig,
    onCloseToastConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <Fragment>
      <div className="toasts-container">
        {viewsInfo?.map((viewInfo) => (
          <Fragment key={viewInfo.id}>
            <ViewContextProvider viewInfo={viewInfo}>
              <ViewComponent viewInfo={viewInfo} />
            </ViewContextProvider>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};
