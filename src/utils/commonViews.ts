import { Alert, Confirm, LoadingDialog, Toast } from "components";
import {
  MessageAlert,
  MessageConfirm,
  MessageLoading,
  MessageLoadingViewModel,
  MessageToast,
  ViewContainerType,
} from "types";
import { openView } from "./viewManager";

export function openToast(message: MessageToast) {
  openView<MessageToast>({
    type: ViewContainerType.Toast,
    id: `toast-${Date.now()}`,
    data: message,
    component: Toast,
    className: "toast-message",
  });
}

export async function openAlert(message: MessageAlert) {
  return new Promise((resolve) => {
    openView<MessageAlert>({
      type: ViewContainerType.Tab,
      id: `alert-${Date.now()}`,
      component: Alert,
      data: message,
      className: "alert-modal",
      onClose: () => {
        resolve(true);
      },
    });
  });
}

export async function openConfirm(message: MessageConfirm) {
  return openCustomConfirm<MessageConfirm>(Confirm, message);
}

export async function openCustomConfirm<T>(
  component: (props?: any) => JSX.Element,
  data: T,
) {
  return new Promise((resolve) => {
    openView<T>({
      type: ViewContainerType.Modal,
      id: `confirm-${Date.now()}`,
      component,
      className: "confirm-modal",
      data,

      onClose: (res: any) => {
        resolve(res);
      },
    });
  });
}

export function openLoading(
  message: MessageLoading,
  viewType?: ViewContainerType.Modal | ViewContainerType.BottomSheet,
) {
  const model = message as MessageLoadingViewModel;
  openView<MessageLoadingViewModel>({
    type: viewType || ViewContainerType.Modal,
    id: `loading-${Date.now()}`,
    data: model,
    component: LoadingDialog,
    className: "loading-message",
    options: {
      disableBackdrop: true,
      onClickedBackdrop: () => {
        model.onClickedBackdrop?.();
      },
    },
  });
}
