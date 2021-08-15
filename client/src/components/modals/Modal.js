import "./modal.scss";
import ReactDOM from "react-dom";
const Modal = ({ closeModal, show, children, isAddMode }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  if (show) {
    return ReactDOM.createPortal(
      <div className={showHideClassName}>
        <section className="modal-main">
          <div className="modal-header">
            <h4>{isAddMode? 'Create Device': 'Edit device'}</h4>
            <div>
              <button type="button" className="close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary mt-4"
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </section>
      </div>,
      document.querySelector("#modal")
    );
  }
  return null;
};
export default Modal;
