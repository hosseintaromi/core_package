import { ReactNode, useRef } from "react";
import { ViewInfo } from "../@types";
import { EventType, useEvent, useInit } from "../hooks";

export function Scrollable({
  children,
  viewInfo,
}: {
  children: ReactNode;
  viewInfo: ViewInfo;
}) {
  const elRef2 = useRef<HTMLElement | undefined>();
  const { updateRef } = useEvent(elRef2, EventType.VerticalSwipe, {
    onTouchMove: () => {
      // console.log("Move horizontal");
    },
    onTouchStart: () => {
      // console.log("Start move horizontal");
    },
    onTouchEnd: () => {
      // console.log("End move horizontal");
    },
  });

  useInit(() => {
    elRef2.current = viewInfo.elRef;
    updateRef();
  });

  return <>{children}</>;
}
