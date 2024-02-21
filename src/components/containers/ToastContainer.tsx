import React from "react";
import { ViewContainerType } from "types";
import { useViewManage } from "hooks";
import { onCloseToastConfig, onOpenToastConfig } from "utils";
import { ViewContextProvider } from "context/ViewContextProvider";
import { ViewComponent } from "../_index";

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
    <React.Fragment>
      <div className="toasts-container">
        {viewsInfo?.map((viewInfo) => (
          <React.Fragment key={viewInfo.id}>
            <ViewContextProvider viewInfo={viewInfo}>
              <ViewComponent viewInfo={viewInfo} />
            </ViewContextProvider>
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
};
