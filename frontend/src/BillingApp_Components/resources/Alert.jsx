import React from "react";
import '../EndUser/Styles/Model.css';

const Alert = ({ content, onConfirm, onCancel }) => {
  return (
    <div className="info-con" style={styles.container}>
      <div style={styles.alertBox}>
        <i
          className="fa-solid fa-xmark"
          style={styles.closeIcon}
          onClick={onCancel}
        ></i>
        <h2 style={styles.content}>{content}</h2>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={onConfirm}>
            Yes
          </button>
          <button style={styles.button} onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  alertBox: {
    width: '38vw',
    height: '23vh',
    borderRadius: '10px',
    backgroundColor: 'white',
    position: 'relative',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  closeIcon: {
    fontSize: '24px',
    position: 'absolute',
    top: '10px',
    right: '20px',
    cursor: 'pointer',
  },
  content: {
    fontWeight: '600',
    fontSize: '18px',
    margin: '10px 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    fontWeight: '600',
    padding: '10px 20px',
    // margin : '20px 0px',
    borderRadius: '10px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Alert;
