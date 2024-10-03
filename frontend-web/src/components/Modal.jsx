function Modal({ className, id, title, body, footer}) {
  return (
    <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-hidden="true">
      <div className={`modal-dialog ${className}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body m-3">
            {body}
          </div>
          <div className="modal-footer">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;