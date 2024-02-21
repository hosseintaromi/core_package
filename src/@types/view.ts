export enum ViewEventType {
  onInit = "onInit",
  onEnter = "onEnter",
  onLeave = "onLeave",
  onClosing = "onClosing",
}

export interface ViewContainerConfig {
  moveBetweenViews?: boolean;
  disableBrowserHistory?: boolean;
  disableFirstTimeAnimate?: boolean;
}

export interface ViewEventArg {
  fromView?: ViewType<any>;
  toView?: ViewType<any>;
  data?: any;
}

export enum ChangeContainerEventType {
  onEnter = "onEnter",
  onLeave = "onLeave",
}

export type CloseType = "Current" | "All" | "AllExceptFirst" | "AllExceptLast";

export interface ViewContainerDataType {
  views: ViewType<any>[];
  containerOrder: number;
  config?: ViewContainerConfig;
  openView: (newView: ViewType<any>) => Promise<any>;
  closeView: (
    view: ViewType<any>,
    newActiveView: ViewType<any> | undefined,
    closeType: CloseType,
  ) => Promise<any>;
  activateView?: (view: ViewType<any>) => Promise<any>;
  changeContainer?: (
    fromView: ViewType<any>,
    eventType: ChangeContainerEventType,
  ) => Promise<any>;
}

export interface ViewEvents {
  onEnter?: (e: ViewEventArg) => void;
  onLeave?: (e: ViewEventArg) => void;
  onClosing?: (e: ViewEventArg) => void;
}

export interface ViewContextType {
  listenEvents: (events: ViewEvents) => () => void;
  emitEvent: (type: ViewEventType, e: ViewEventArg) => void;
  getViewData: () => any;
  close?: <T>(type: CloseType, res?: T) => void;
  openView?: <T = any>(view: Omit<ViewType<T>, "type">) => void;
}

export interface ViewConfig {
  disableBackdrop?: boolean;
  disableAnimate?: boolean;
  inBackground?: boolean;
  params?: any;
  onClickedBackdrop?: () => void;
}

export interface ViewType<T> {
  type: string;
  id: string;
  data?: T;
  className?: string;
  component: (props?: any) => JSX.Element;
  onClose?: (res?: any) => void;
  onClosed?: (res?: any) => void;
  onOpened?: () => void;
  options?: ViewConfig;
}

export interface ViewInfo {
  id: string;
  view: ViewType<any>;
  events?: ViewEvents;
  elRef?: HTMLElement;
  onInit?: (el: HTMLElement) => void;
}

export interface ViewEventConfigBase {
  disableAnimate?: boolean;
}

export interface ViewEventConfigClose extends ViewEventConfigBase {
  closeType?: CloseType;
}

export interface ViewEvent<T = ViewEventConfigBase> {
  duration?: number;
  start?: (newView: ViewRef, prevView?: ViewRef, config?: T) => void;
  end?: (newView: ViewRef, prevView?: ViewRef, config?: T) => void;
  animate?: (
    t: number,
    newView: ViewRef,
    prevView?: ViewRef,
    config?: T,
  ) => void;
}

export interface HistoryItem {
  id: string;
  back: () => void;
}

export interface ViewRef {
  view: ViewType<any>;
  ref: HTMLElement;
}
