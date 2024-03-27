import { Fragment } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks";
import {
  closeTabAnimationConfig,
  onLeaveContainerConfig,
  openTabContainerConfig,
} from "../../utils/viewAnimations";
import { ViewComponent } from "../index";

export const PartialTabContainer = ({
  containerName,
}: {
  containerName: string;
}) => {
  const { viewsInfo } = useViewManage(
    containerName,
    0,
    {},
    openTabContainerConfig,
    closeTabAnimationConfig,
    openTabContainerConfig,
    openTabContainerConfig,
    onLeaveContainerConfig,
  );

  return viewsInfo.length === 0 ? (
    <></>
  ) : (
    <div className="partial-tab-container">
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
