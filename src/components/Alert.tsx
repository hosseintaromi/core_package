import { useView } from "../hooks";
import { MessageAlert, MessageType } from "../@types";

export function Alert() {
  const { viewData, close } = useView<MessageAlert>({});

  return (
    <div
      className={`alert ${
        viewData.type === MessageType.Success ? "alert-success" : "alert-error"
      }`}
    >
      {viewData.type === MessageType.Error ? (
        <div className="sa-icon sa-error">
          <span className="sa-x-mark">
            <span className="sa-line sa-left" />
            <span className="sa-line sa-right" />
          </span>
        </div>
      ) : (
        <div className="sa-icon sa-success">
          <span className="sa-line sa-tip" />
          <span className="sa-line sa-long" />
          <div className="sa-placeholder" />
          <div className="sa-fix" />
        </div>
      )}
      {viewData.title ? (
        <div className="modal-title">{viewData.title}</div>
      ) : (
        <></>
      )}
      <div className="modal-message">{viewData.message}</div>
      <button
        className={`btn ${
          viewData.type === MessageType.Success ? " btn-success" : " btn-error"
        }`}
        onClick={close}
      >
        بستن
      </button>
    </div>
  );
}
