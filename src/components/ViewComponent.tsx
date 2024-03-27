import { Suspense, useRef } from "react";
import { useInit } from "../hooks";
import { ViewInfo } from "../@types";
import { ErrorBoundaryWrapper } from "./ErrorBoundaryWrapper";

export function ViewComponent({ viewInfo }: { viewInfo: ViewInfo }) {
  const elRef = useRef<any>(null);
  const className = (viewInfo.view.className || "").trim();

  useInit(() => {
    if (!viewInfo.elRef) {
      viewInfo.elRef = elRef.current;
      viewInfo.onInit?.(elRef.current);
    }
  });

  const View = viewInfo.view.component;

  return (
    <div
      ref={elRef}
      className={`view-wrapper${className ? ` ${className}` : ""}`}
    >
      <ErrorBoundaryWrapper>
        <Suspense fallback="loading...">
          <View />
        </Suspense>
      </ErrorBoundaryWrapper>
    </div>
  );
}
