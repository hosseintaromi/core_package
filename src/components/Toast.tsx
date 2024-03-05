import { useRef } from "react";
import { useInit, useView } from "hooks";
import { MessageToast, MessageType } from "types";
import "../styles/toast.css";

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
      className={`toast ${
        viewData.type === MessageType.Success ? "toast-success" : "toast-danger"
      }`}
    >
      <div className="toast-body">
        {viewData.message}
        <button className="toast-close" onClick={() => close({ res: true })} />
      </div>
    </div>
  );
}
