import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { ViewComponent } from "../ViewComponent";
import { useViewManage } from "../../hooks/useViewManage";
import { openView } from "../../utils/viewManager";
import { EventType, TouchEvent, useEvent } from "../../hooks/useEvent";
import { useAnimate } from "../../hooks/useAnimate";
import { setStyle } from "../../utils";
import { ViewContextProvider } from "../../context/ViewContextProvider";
import { clientWidth, querySelectorAll } from "../../utils/dom-utils";

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

const SlideContainer = <T, U>({
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
  const animateRequestRef = useRef<() => void>();
  const pointerContainerRef = useRef<any>(null);
  const pointerRef = useRef<any>(null);

  const { requestAnimate, cancelAnimate } = useAnimate();

  const { viewsInfo } = useViewManage(containerType, 6, {
    moveBetweenViews: true,
    disableBrowserHistory: true,
  });

  const setPointerPos = (from: number, to: number, percent: number) => {
    if (from === to) {
      return;
    }
    const childsEl = querySelectorAll(pointerContainerRef.current, ".item");
    let fromOffset = 0;
    let toOffset = 0;
    for (let i = 0; i < from; i++) {
      fromOffset += clientWidth(childsEl[i]);
    }
    for (let i = 0; i < to; i++) {
      toOffset += clientWidth(childsEl[i]);
    }
    const baseWidth = clientWidth(childsEl[0]);
    const fromEl = childsEl[from];
    const toEl = childsEl[to];
    const fromScale = (1 * fromEl.clientWidth) / baseWidth;
    const toScale = (1 * toEl.clientWidth) / baseWidth;
    const pointerEl: HTMLElement = pointerRef.current;
    const scale = fromScale + ((toScale - fromScale) * percent) / 100;
    setStyle(pointerEl, {
      transform: `translateX(${
        fromOffset + ((toOffset - fromOffset) * percent) / 100
      }px) scaleX(${scale})`,
    });

    for (const child of pointerEl.children as any) {
      setStyle(child, { transform: `scaleX(${1 / scale})` });
    }
  };

  const openConfigView = useCallback(
    async (index: number) => {
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
      if (ref) {
        setStyle(ref, { display: "block" });
        if (index > 0) {
          setStyle(ref, { transform: `translateX(100%)` });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
      setStyle(el, { display: "none" });
    });
  };

  const transform = (percent: number, fromIndex: number, toIndex: number) => {
    const from = getView(fromIndex);
    const to = getView(toIndex);

    let direction = fromIndex > toIndex ? 1 : -1;

    setPointerPos(fromIndex, toIndex, percent);

    hideViews(viewsInfo.map((x) => x.elRef));
    if (from) {
      const style1 = from.style;
      style1.transform = `translateX(${direction * percent}%)`;
      style1.display = "block";
    }

    if (to) {
      const style2 = to.style;
      style2.transform = `translateX(${direction * (percent - 100)}%)`;
      style2.display = "block";
    }
  };

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
    const newXMove =
      totalXMove % containerWidth === 0 && totalXMove !== 0
        ? containerWidth
        : totalXMove % containerWidth;
    let to = index + moveViewCount;
    const percent = (Math.abs(newXMove) / containerWidth) * 100;
    return {
      from: totalXMove < 0 ? to - 1 : Math.min(lastViewIndex, to + 1),
      to,
      percent,
      moveX: newXMove,
      totalXMove,
    } as MoveInfo;
  };

  const sweep = (e: TouchEvent) => {
    const moveInfo = getNewXMove(viewIndexRef.current, e.moveX);
    // if (viewIndexRef.current <= moveInfo.to && e.moveX >= 0) {
    //   return;
    // }
    // if (viewIndexRef.current >= moveInfo.to && e.moveX <= 0) {
    //   return;
    // }
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
        transform(percent, moveInfo.from, moveInfo.to);
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

  const setPointerStartPos = (index: number) => {
    const childsEl = (pointerContainerRef.current as HTMLElement).children;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += childsEl[i].clientWidth;
    }
    const pointerEl: HTMLElement = pointerRef.current;

    setStyle(pointerEl, {
      width: `${clientWidth(childsEl[index])}px`,
      left: `${offset}px`,
    });
  };

  const transfromWithAnimate = (duration: number, from: number, to: number) => {
    animateRequestRef.current = requestAnimate(
      duration,
      (t) => {
        transform(t * 100, from, to);
      },
      () => {
        startMoveXRef.current = 0;
        viewIndexRef.current = to;
      },
    );
  };

  const goToIndex = (index: number) => {
    transfromWithAnimate(200, viewIndexRef.current, index);
  };

  useEffect(() => {
    hideViews(components.map((x) => x.ref));
    setPointerStartPos(0);
    openConfigView(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="slide-inline-container">
      <div className="slide-tabs" ref={pointerContainerRef}>
        {config.components?.map((component, index) => (
          <div className="item" key={index} onClick={() => goToIndex(index)}>
            {component.title}
          </div>
        ))}
        <div className="pointer" ref={pointerRef} />
      </div>
      <div className="slider-container">
        {viewsInfo?.map((viewInfo) => (
          <React.Fragment key={viewInfo.id}>
            <ViewContextProvider viewInfo={viewInfo}>
              <ViewComponent viewInfo={viewInfo} />
            </ViewContextProvider>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SlideContainer;
