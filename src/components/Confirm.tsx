import { useView } from "../hooks";
import { MessageConfirm } from "../@types";
import "../styles/modal.css";
import "../styles/confirm.css";

export function Confirm() {
  const { close, viewData } = useView<MessageConfirm>({});

  return (
    <div className="confirm">
      {viewData.title ? (
        <div className="modal-title">{viewData.title}</div>
      ) : (
        <></>
      )}
      <div className="modal-message">{viewData?.message}</div>
      <div className="modal-btn">
        <button className="btn btn-success" onClick={() => close(true)}>
          بله
        </button>
        <button className="btn btn-error" onClick={() => close(false)}>
          خیر
        </button>
      </div>
    </div>
  );
}
