import { Suspense, useRef } from "react";
import { useInit, useView } from "hooks";
import { ViewInfo } from "types";
import { useRerender } from "src/hooks/useRerender";
import { ErrorBoundaryWrapper } from "./ErrorBoundaryWrapper";

export function ViewComponent({ viewInfo }: { viewInfo: ViewInfo }) {
  const elRef = useRef<any>(null);
  const { rerender } = useRerender();
  const className = (viewInfo.view.className || "").trim();

  useInit(() => {
    viewInfo.elRef = elRef.current;
    viewInfo.onInit?.(elRef.current);
  });

  const View = viewInfo.view.component;

  useView({
    onUpdate: (e: any) => {
      if (e.viewId === viewInfo.id) {
        viewInfo.view.component = e.component;
        rerender();
      }
    },
  });

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
