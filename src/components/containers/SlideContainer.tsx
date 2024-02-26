import { Fragment, MutableRefObject, useRef } from "react";
import { ViewContextProvider } from "context/ViewContextProvider";
import {
  EventType,
  TouchEvent,
  useAnimate,
  useEvent,
  useFn,
  useInit,
  useViewManage,
} from "hooks";
import { openView } from "utils";
import { ElementRef } from "./ElementRef";
import { ViewComponent } from "../_index";

interface MoveInfo {
  from: number;
  to: number;
  percent: number;
  moveX: number;
  totalXMove: number;
}

export interface SlideComponent {
  title: string;
  component: (props?: any) => JSX.Element;
  ref?: HTMLElement;
}

export interface SlideInlineData<T, U> {
  id?: string;
  event: EventType;
  elRef?: MutableRefObject<HTMLElement>;
  data?: T;
  title?: string;
  className?: string;
  components: SlideComponent[];
  onClose?: (res?: U) => void;
  mapDataTo?: (data?: T) => any;
  show?: (show: boolean) => void;
}

export const SlideContainer = <T, U>({
  config,
}: {
  config: SlideInlineData<T, U>;
}) => {
  const containerType = `slide-${Date.now()}`;
  const lastViewIndex = config.components.length - 1;
  const effectivePercent = 35;
  const maxDuration = 500;
  const minDuration = 150;
  const components = config.components;
  // const slideIn = bezier(0.25, 1, 0.5, 1);

  const containerRef = useRef<any>(null);
  const viewIndexRef = useRef<number>(0);
  const startMoveXRef = useRef<number>(0);
  const touchTimeRef = useRef<number>(0);
  const transformPercentRef = useRef<number>(0);
  const animateRequestRef = useRef<() => void>();

  const { requestAnimate, cancelAnimate } = useAnimate();

  const getContainerWidth = () => containerRef.current.clientWidth;

  const getNewXMove = (index: number, moveX: number) => {
    const containerWidth = getContainerWidth();
    let totalXMove = startMoveXRef.current + moveX;
    if (totalXMove >= 0) {
      const maxMoveX = index * containerWidth;
      totalXMove = Math.min(maxMoveX, totalXMove);
    } else {
      const minMove = (index - lastViewIndex) * containerWidth;
      totalXMove = Math.max(minMove, totalXMove);
    }
    const moveViewCount =
      (totalXMove <= 0 ? 1 : -1) *
      Math.ceil(Math.abs(totalXMove / containerWidth));
    const newXMove = totalXMove % containerWidth;
    let to = index + moveViewCount;
    const percent = (Math.abs(newXMove) / containerWidth) * 100;
    return {
      from: totalXMove < 0 ? to - 1 : to + 1,
      to,
      percent,
      moveX: newXMove,
      totalXMove,
    } as MoveInfo;
  };

  const { viewsInfo } = useViewManage(containerType, 6, {
    moveBetweenViews: true,
    disableBrowserHistory: true,
  });

  const openConfigView = useFn(async (index: number) => {
    let viewInfo = viewsInfo.find((x) => x.id === `${index}`);
    if (viewInfo) {
      return;
    }
    await openView({
      id: `${index}`,
      type: containerType,
      component: config.components[index].component,
      data: config.data,
      className: config.className,
      options: { disableAnimate: true, inBackground: index > 0 },
    });
    viewInfo = viewsInfo.find((x) => x.id === `${index}`);
    const ref = viewInfo?.elRef;
    ref!.style.display = "block";
    if (index > 0) {
      ref!.style.transform = `translate3d(100%, 0, 0)`;
    }
  });

  const getView = (index: number) => {
    if (index < 0 || index > lastViewIndex) {
      return;
    }
    const view = viewsInfo.find((x) => x.id === `${index}`);
    if (!view) {
      openConfigView(index);
    }
    return view?.elRef;
  };

  const hideViews = (elements: (HTMLElement | any)[]) => {
    elements.forEach((el) => {
      if (el) {
        el.style.display = "none";
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setPointer = (index: number, percent: number, left: boolean) => {
    // const el = components[index].ref!;
    // const elStyle = el.style;
    // elStyle.display = "block";
    // const width = el.clientWidth;
    // elStyle.left = "auto";
    // elStyle.right = "auto";
    // const transforming = percent % 100 !== 0;
    // elStyle.borderRadius = `${transforming && left ? 0 : 3}px ${
    //   transforming && !left ? 0 : 3
    // }px 0 0`;
    // elStyle[left ? "left" : "right"] = ((percent % 100) * width) / 100 + "px";
  };

  const transform = (
    percent: number,
    fromIndex: number,
    toIndex: number,
    animate?: boolean,
  ) => {
    if ((transformPercentRef.current || 0) === percent) {
      return;
    }
    transformPercentRef.current = percent % 100;
    const from = getView(fromIndex);
    const to = getView(toIndex);
    let direction = fromIndex > toIndex ? 1 : -1;
    hideViews(viewsInfo.map((x) => x.elRef));
    hideViews(components.map((x) => x.ref));
    if (percent % 100 === 0) {
      direction = 0;
    }

    if (from && ((animate && percent !== 100) || (!animate && percent !== 0))) {
      const style = from.style;
      style.transform = `translate3d(${direction * percent}%, 0, 0)`;
      style.display = "block";
      setPointer(fromIndex, -percent, fromIndex > toIndex);
    }
    if (to && ((animate && percent !== 0) || (!animate && percent !== 100))) {
      const style = to.style;
      style.transform = `translate3d(${direction * (percent - 100)}%, 0, 0)`;
      style.display = "block";
      setPointer(toIndex, percent - 100, fromIndex < toIndex);
    }
  };

  const sweep = (e: TouchEvent) => {
    const moveInfo = getNewXMove(viewIndexRef.current, e.moveX);
    if (
      viewIndexRef.current === moveInfo.to &&
      transformPercentRef.current === 0 &&
      e.moveX === 0
    ) {
      return;
    }

    transform(moveInfo.percent, moveInfo.from, moveInfo.to);
  };

  const animate = (moveX: number) => {
    const moveInfo = getNewXMove(viewIndexRef.current, moveX);
    const currentPercent = moveInfo.percent;
    if (currentPercent === 0) {
      startMoveXRef.current = 0;
      viewIndexRef.current = moveInfo.to;
      return;
    }
    const effectiveMovement = currentPercent >= effectivePercent;
    const touchTime = Date.now() - touchTimeRef.current;
    const sweeping = Math.abs(moveX) > 50 && touchTime < 100;
    const backward = !sweeping && !effectiveMovement;
    const remainPercent =
      (backward ? currentPercent : 100 - currentPercent) / 100;
    const containerWidth = getContainerWidth();
    const touchDuration =
      ((backward ? containerWidth - moveX : moveX) * touchTime) / moveX;
    startMoveXRef.current = moveInfo.totalXMove;
    const duration = Math.max(
      remainPercent * minDuration,
      Math.min(touchDuration, remainPercent * maxDuration),
    );

    animateRequestRef.current = requestAnimate(
      duration,
      (t) => {
        const percent = backward
          ? currentPercent * (1 - t)
          : currentPercent + (100 - currentPercent) * t;
        startMoveXRef.current = moveInfo.totalXMove;
        transform(percent, moveInfo.from, moveInfo.to, true);
      },
      () => {
        startMoveXRef.current = 0;
        viewIndexRef.current = backward ? moveInfo.from : moveInfo.to;
      },
    );
  };

  useEvent(containerRef, EventType.HorizontalSwipe, {
    onTouchStart: (e: TouchEvent) => {
      touchTimeRef.current = Date.now();
      const animateRequest = animateRequestRef.current;
      if (animateRequest) {
        cancelAnimate(animateRequest);
        animateRequestRef.current = undefined;
      }
      sweep(e);
    },
    onTouchMove: (e: TouchEvent) => {
      sweep(e);
    },
    onTouchEnd: (e: TouchEvent) => {
      sweep(e);
      animate(e.moveX);
    },
  });

  useInit(() => {
    hideViews(components.map((x) => x.ref));
    setPointer(0, 0, true);
    openConfigView(0);
  });

  return (
    <div ref={containerRef} className="slide-inline-container">
      <ul className="slide-tabs nnnnn">
        {config.components?.map((component, index) => (
          <li key={index}>
            {component.title}
            <ElementRef
              className="pointer"
              onLoad={(ref) => {
                component.ref = ref;
              }}
            />
          </li>
        ))}
      </ul>
      <div className="slider-container">
        {viewsInfo?.map((viewInfo) => (
          <Fragment key={viewInfo.id}>
            <ViewContextProvider viewInfo={viewInfo}>
              <ViewComponent viewInfo={viewInfo} />
            </ViewContextProvider>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
