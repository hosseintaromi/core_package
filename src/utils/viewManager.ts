import {
  ViewContainerType,
  ChangeContainerEventType,
  CloseType,
  ViewContainerConfig,
  ViewContainerDataType,
  ViewType,
  ViewUpdateEventArg,
} from "../@types";
import { listenBack, unListenBack } from "./historyManager";

const viewContainers: { [name: string]: ViewContainerDataType } = {};
const loadedViewsStack: ViewType<any>[] = [];
const progressViews: { [containerType: string]: string[] } = {};

export function registerContainer(
  containerName: string,
  containerOrder: number,
  config: ViewContainerConfig,
  openView: (view: ViewType<any>) => Promise<any>,
  closeView: (
    view: ViewType<any>,
    newActiveView: ViewType<any> | undefined,
    closeType: CloseType,
  ) => Promise<any>,
  activateView?: (view: ViewType<any>) => Promise<any>,
  changeContainer?: (
    fromView: ViewType<any>,
    eventType: ChangeContainerEventType,
  ) => Promise<any>,
  updateView?: (viewUpdate: ViewUpdateEventArg) => void,
) {
  if (viewContainers[containerName]) {
    // console.warn("ViewModule", "Duplicate container type");
    return;
  }

  viewContainers[containerName] = {
    views: [],
    containerOrder,
    config,
    openView,
    closeView,
    activateView,
    changeContainer,
    updateView,
  };
}

export function removeContainer(containerName: string) {
  if (viewContainers[containerName]) {
    loadedViewsStack.removeAll((x) => x.type === containerName);
    delete viewContainers[containerName];
  }
}

export async function openView<T = any>(
  view: Omit<ViewType<T>, "id"> & {
    id?: string;
  },
) {
  try {
    if (!view.id) {
      view.id = `${view.type}-${Date.now()}`;
    }
    const container = viewContainers[view.type];
    if (!container) {
      return;
    }

    if (isViewInProgress(view.type, view.id, "open")) {
      return;
    }

    const foundView = container.views.find((x) => x.id === view.id);
    if (foundView && !container.config?.moveBetweenViews) {
      return;
    }

    const topView = getTopViewFromStack();
    const isSameType = topView?.type === view.type;
    if (isSameType && topView?.id === view.id) {
      return;
    }
    if (topView && !isSameType) {
      const topViewContainer = viewContainers[topView.type];
      topViewContainer.changeContainer?.(
        view as ViewType<T>,
        ChangeContainerEventType.onLeave,
      );
    }

    if (!container.config?.disableBrowserHistory) {
      listenBack({
        id: view.id,
        back: () => {
          closeView(view.id!, view.type);
        },
      });
    }

    setViewInProgress(view.type, view.id, true, "open");
    if (foundView) {
      await container.activateView?.(foundView);
      moveViewToTop(foundView);
    } else {
      container.views.push(view as ViewType<T>);
      view.onOpen?.();
      await container.openView(view as ViewType<T>);
      view.onOpened?.();
      addToLoadedViewStack(view as ViewType<T>);
    }
    setViewInProgress(view.type, view.id, false, "open");
  } catch (error) {
    setViewInProgress(view.type, view.id!, false, "open");
  }
}

export async function closeView<T>(
  viewId: string,
  containerType: string,
  closeType: CloseType = "Current",
  res?: T,
) {
  try {
    if (!viewId || !containerType) {
      return;
    }
    const container = viewContainers[containerType];
    if (!container) {
      return;
    }

    if (isViewInProgress(containerType, viewId, "close")) {
      return;
    }

    const index = container.views.findIndex((x) => x.id === viewId);
    if (index < 0) {
      return;
    }
    if (isMasterView(containerType, container)) {
      return;
    }
    const closingView = container.views[index];
    const topView = getTopViewFromStack([closingView.id]);
    const ignoreViewsId = getViewsByCloseType(
      container.views.map((x) => x.id),
      closeType,
      index,
    );
    const topViewWithSameType = getTopViewFromStack(
      ignoreViewsId,
      closingView.type as any,
    );
    const isSameType = topView?.type === closingView.type;
    if (topView && !isSameType) {
      const topViewContainer = viewContainers[topView.type];
      topViewContainer.changeContainer?.(
        closingView,
        ChangeContainerEventType.onEnter,
      );
    }
    if (!container.config?.disableBrowserHistory) {
      unListenBack(viewId);
    }
    setViewInProgress(containerType, viewId, true, "close");
    closingView.onClose?.(res);
    await container.closeView(closingView, topViewWithSameType, closeType);
    closingView.onClosed?.(res);
    updateViewsByCloseType(container.views, closeType, index);
    removeFromLoadedViewStack(closingView, closeType);
    setViewInProgress(containerType, viewId, false, "close");
  } catch {
    setViewInProgress(containerType, viewId, false, "close");
  }
}

export async function updateView(
  viewUpdate: ViewUpdateEventArg,
  containerType: string,
) {
  if (!viewUpdate.viewId || !containerType) {
    return;
  }
  const container = viewContainers[containerType];
  if (container) {
    container.updateView?.(viewUpdate);
  }
}

export function updateViewsByCloseType(
  views: any[],
  type: CloseType,
  index: number,
) {
  const length = views.length;
  switch (type) {
    case "All":
      return views.splice(0, length);
    case "AllExceptFirst":
      return views.splice(1, length - 1);
    case "AllExceptLast":
      return views.splice(0, length - 1);
    case "Current":
      return views.splice(index, 1);
  }
}

export function getViewsByCloseType(
  views: any[],
  type: CloseType,
  index: number,
) {
  const length = views.length;
  switch (type) {
    case "All":
      return views.slice(0, length);
    case "AllExceptFirst":
      return views.slice(1, length);
    case "AllExceptLast":
      return views.slice(0, length - 1);
    case "Current":
      return views[index];
  }
}

function addToLoadedViewStack(view: ViewType<any>) {
  loadedViewsStack.push(view);
}

function removeFromLoadedViewStack(view: ViewType<any>, closeType: CloseType) {
  switch (closeType) {
    case "All":
      loadedViewsStack.removeAll((x) => x.type === view.type);
      break;
    case "AllExceptFirst":
      loadedViewsStack.removeAll((x) => x.id !== loadedViewsStack[0].id);
      break;
    case "AllExceptLast":
      loadedViewsStack.removeAll((x) => x.id !== loadedViewsStack.last().id);
      break;
    case "Current":
      loadedViewsStack.remove((x) => x.id === view.id);
      break;
  }
}

function isMasterView(type: string, container: ViewContainerDataType) {
  return type === "MasterTab" && container.views.length < 2;
}

function moveViewToTop(view: ViewType<any>) {
  const removed = loadedViewsStack.remove((x) => x.id === view.id);
  if (removed) {
    loadedViewsStack.push(removed);
  }
}

function getTopViewFromStack(
  ignoreViewsId?: string[],
  type?: ViewContainerType,
): ViewType<any> | undefined {
  for (let i = loadedViewsStack.length - 1; i >= 0; i--) {
    const view = loadedViewsStack[i];
    if (
      (ignoreViewsId || []).indexOf(view.id) < 0 &&
      (type === undefined || view.type === type)
    ) {
      return view;
    }
  }
}

function isViewInProgress(
  containerType: string,
  viewId: string,
  progressType: "open" | "close",
) {
  return (
    (progressViews[containerType] || []).findIndex(
      (id) => id === `${viewId}_${progressType}`,
    ) > -1
  );
}

function setViewInProgress(
  containerType: string,
  viewId: string,
  progress: boolean,
  progressType: "open" | "close",
) {
  let views = progressViews[containerType];
  if (!views) {
    views = progressViews[containerType] = [];
  }
  views.remove((id) => id === `${viewId}_close`);
  views.remove((id) => id === `${viewId}_open`);
  if (progress) {
    views.safePush(`${viewId}_${progressType}`);
  }
}
