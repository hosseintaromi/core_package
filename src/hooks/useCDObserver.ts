import {
  ContainerDataType,
  useContainer,
} from "../stories/slider/DataContainer";
import { useObserver } from "./useObserver";
import { useView } from "./useView";

export const useCDObserver = <T>(containerId?: string) => {
  const { container, getContainer } = useContainer();
  const targetContainer = containerId
    ? getContainer(containerId) || container
    : container;
  return useObserver<T>(targetContainer.observer, targetContainer.data);
};

export const useCDObserverFromView = <T>(containerId?: string) => {
  const { viewData } = useView<ContainerDataType<T>>();
  const targetContainer = containerId
    ? viewData?.getContainer(containerId) || viewData
    : viewData;
  return useObserver<T>(targetContainer.observer, targetContainer.data);
};

export const useCDFromView = <T>(containerId?: string) => {
  const { viewData } = useView<ContainerDataType<T>>();
  const targetContainer = containerId
    ? viewData?.getContainer(containerId) || viewData
    : viewData;
  return targetContainer;
};

export const useCDDataFromView = <T>(containerId?: string) => {
  const { viewData } = useView<ContainerDataType<T>>();
  const targetContainer = containerId
    ? viewData?.getContainer(containerId) || viewData
    : viewData;
  return targetContainer.data;
};
