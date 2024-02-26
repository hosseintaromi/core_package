import React from "react";
import { ViewContextProvider } from "context/ViewContextProvider";
import { useViewManage } from "hooks";
import {
  closeTabAnimationConfig,
  openTabContainerConfig,
} from "src/utils/viewAnimations";
import { ViewContainerType } from "types";
import { ViewComponent } from "../_index";

export const TabContainer = () => {
  const { viewsInfo } = useViewManage(
    ViewContainerType.Tab,
    2,
    {},
    openTabContainerConfig,
    closeTabAnimationConfig,
    openTabContainerConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <React.Fragment>
      <div className="tab-container">
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
