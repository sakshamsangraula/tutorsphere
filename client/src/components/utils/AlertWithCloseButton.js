import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function AlertWithCloseButton({ message, variant = 'warning', showAlert, handleShowAlert }) {
  const [show, setShow] = useState(true);

  if (!show) {
    return null;
  }

  return (
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
      {message}
    </Alert>
  );
}

export default AlertWithCloseButton;
