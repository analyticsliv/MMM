import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUrl: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, authUrl }) => {
  if (!isOpen) return null;

  // Function to open the auth URL in a new window
  const handleAuth = () => {
    if (authUrl) {
      const popup = window.open(authUrl, 'authPopup', 'width=600,height=600');
      if (popup) {
        popup.focus();
      }
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <button onClick={onClose} style={modalStyles.closeButton}>X</button>
        <button onClick={handleAuth} style={modalStyles.authButton}>Authorize</button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
  },
  authButton: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Modal;
