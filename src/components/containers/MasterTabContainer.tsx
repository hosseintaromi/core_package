import { Fragment } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks";
import { ViewContainerType } from "../../@types";
import {
  activateTabConfig,
  closeTabAnimationConfig,
  onEnterTabContainerConfig,
  onLeaveContainerConfig,
} from "../../utils/viewAnimations";
import { ViewComponent } from "../index";

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
        <Fragment key={viewInfo.id}>
          <ViewContextProvider viewInfo={viewInfo}>
            <ViewComponent viewInfo={viewInfo} />
          </ViewContextProvider>
        </Fragment>
      ))}
    </div>
  );
};
