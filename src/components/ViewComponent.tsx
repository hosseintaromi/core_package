import { useRef } from "react";
import { useInit } from "hooks";
import { ViewInfo } from "types";

export function ViewComponent({ viewInfo }: { viewInfo: ViewInfo }) {
  const elRef = useRef<any>(null);
  const className = (viewInfo.view.className || "").trim();

  useInit(() => {
    viewInfo.elRef = elRef.current;
    viewInfo.onInit?.(elRef.current);
  });

  return (
    <div
      ref={elRef}
      className={`view-wrapper${className ? ` ${className}` : ""}`}
    >
      {viewInfo.view.component()}
    </div>
  );
}
