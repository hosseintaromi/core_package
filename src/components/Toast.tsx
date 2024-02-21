import { useRef } from "react";
import { useInit, useView } from "hooks";
import { MessageToast, MessageType } from "types";
import "styles/toast.css";

export function Toast() {
  const timer = useRef<NodeJS.Timeout>();

  const { close, viewData } = useView<MessageToast>({});

  useInit(() => {
    if (viewData.delay) {
      timer.current = setTimeout(() => {
        close();
      }, viewData.delay * 1000);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  });

  return (
    <div
      className={
        "toast " +
        (viewData.type === MessageType.Success
          ? "toast-success"
          : "toast-danger")
      }
    >
      <div className="toast-body">
        {viewData.message}
        <button className="toast-close" onClick={() => close({ res: true })}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 50 50"
          >
            <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
