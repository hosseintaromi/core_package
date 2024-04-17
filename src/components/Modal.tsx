import "../styles/modal.css";
import "../styles/confirm.css";

export function Modal() {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <div className="modal-title">عنوان مودال</div>
      </div>
      <div className="modal-body">محتوای مودال</div>
    </div>
  );
}
