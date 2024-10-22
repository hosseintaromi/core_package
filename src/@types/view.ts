import { LazyExoticComponent } from "react";

export enum ViewEventTypeEnum {
  onInit = "onInit",
  onEnter = "onEnter",
  onLeave = "onLeave",
  onClosing = "onClosing",
  onUpdate = "onUpdate",
}

export interface ViewContainerConfig {
  moveBetweenViews?: boolean;
  disableBrowserHistory?: boolean;
  disableFirstTimeAnimate?: boolean;
}

export interface ViewConfig {
  disableBackdrop?: boolean;
  disableAnimate?: boolean;
  inBackground?: boolean;
  params?: any;
  onClickedBackdrop?: () => void;
}

type ComponentType =
  | ((props?: any) => JSX.Element)
  | LazyExoticComponent<() => JSX.Element>;

export interface ViewType<T> {
  type: string;
  id: string;
  data?: T;
  className?: string;
  component: ComponentType;
  onClose?: (res?: any) => void;
  onClosed?: (res?: any) => void;
  onOpen?: () => void;
  onOpened?: () => void;
  options?: ViewConfig;
}

export interface ViewEventArg {
  fromView?: ViewType<any>;
  toView?: ViewType<any>;
  data?: any;
}

export interface ViewUpdateEventArg {
  viewId: string;
  component: ComponentType;
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
  updateView?: (viewUpdate: ViewUpdateEventArg) => void;
  listeners: ((view: ViewType<any>) => void)[];
}

export interface ViewEvents {
  onEnter?: (e: ViewEventArg) => void;
  onLeave?: (e: ViewEventArg) => void;
  onClosing?: (e: ViewEventArg) => void;
  onUpdate?: (e: ViewUpdateEventArg) => void;
}

export interface ViewContextType {
  listenEvents: (events: ViewEvents) => () => void;
  emitEvent: (
    type: ViewEventTypeEnum,
    e: ViewEventArg | ViewUpdateEventArg,
  ) => void;
  getViewData: () => any;
  close?: <T>(type: CloseType, res?: T) => void;
  openView?: <T = any>(view: Omit<ViewType<T>, "type">) => void;
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

export interface ViewRef {
  view: ViewType<any>;
  ref: HTMLElement;
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

export type ViewEventType =
  | ((e: ViewEventArg) => void)
  | ((e: ViewUpdateEventArg) => void);
