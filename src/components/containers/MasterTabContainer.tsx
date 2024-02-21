import React from "react";
import { ViewContextProvider } from "context/ViewContextProvider";
import {
  activateTabConfig,
  closeTabAnimationConfig,
  onEnterTabContainerConfig,
  onLeaveContainerConfig,
} from "utils";
import { useViewManage } from "hooks";
import { ViewContainerType } from "types";
import { ViewComponent } from "../_index";

export const MasterTabContainer = () => {
  const { viewsInfo } = useViewManage(
    ViewContainerType.MasterTab,
    0,
    {
      moveBetweenViews: true,
    },
    activateTabConfig,
    closeTabAnimationConfig,
    activateTabConfig,
    onEnterTabContainerConfig,
    onLeaveContainerConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className="tab-wrapper">
      {viewsInfo?.map((viewInfo) => (
        <React.Fragment key={viewInfo.id}>
          <ViewContextProvider viewInfo={viewInfo}>
            <ViewComponent viewInfo={viewInfo} />
          </ViewContextProvider>
        </React.Fragment>
      ))}
    </div>
  );
};
