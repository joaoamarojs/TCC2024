import React from 'react';

function Alert({ className, message }) {
  return (
    <div className={`alert ${className} alert-dismissible`} role="alert">
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      <div className="alert-message">
        <strong>{message.title}</strong> {message.body}
      </div>
    </div>
  );
}

export default Alert;