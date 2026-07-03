import "../styles/modal.css";

function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <div className="modal-icon">⚠️</div>

        <div>
          <h2>{title}</h2>
          <p>{message}</p>

          <div className="modal-actions">
            <button className="modal-cancel" onClick={onCancel}>
              Cancel
            </button>

            <button className="modal-delete" onClick={onConfirm}>
              Delete Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;