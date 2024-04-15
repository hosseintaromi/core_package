import { MutableRefObject, ReactNode, forwardRef, useEffect } from "react";
import { OverlayPositionType } from "../../@types";
import { useFn, useInit, useOverlay } from "../../hooks";

type PropsType = {
  children: ReactNode;
  position?: OverlayPositionType;
  className?: string;
  gap?: number;
};
export const Overlay = forwardRef<
  MutableRefObject<{ toggle: (e: any) => void }> | undefined,
  PropsType
>((props, ref) => {
  const config = useOverlay<any, any>({
    component: () => <>{props.children}</>,
    positionType: "ByElement",
    className: props.className,
    position: props.position,
    gap: props.gap,
  });

  const toggle = useFn((e: Event) => {
    config.current?.toggle?.(e);
  });

  const hide = useFn(() => {
    config.current?.hide?.();
  });

  useEffect(() => {
    config.current?.update?.(props.children);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]);

  useInit(() => {
    if (!ref) {
      ref = {} as any;
    }
    (ref! as MutableRefObject<any>).current = {
      toggle,
      hide,
    };
  });

  return <></>;
});
