import { Fragment } from "react";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { useViewManage } from "../../hooks";
import {
  closeTabAnimationConfig,
  openTabContainerConfig,
} from "../../utils/viewAnimations";
import { ViewContainerType } from "../../@types";
import { ViewComponent } from "../index";

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
    <Fragment>
      <div className="tab-container">
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
