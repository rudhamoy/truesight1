import React, { useState, useEffect } from 'react';
import { makeStyles } from '@fluentui/react-components';

// Define platform-specific styles and behaviors
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const useStyles = makeStyles({
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '32px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #e0e0e0',
    WebkitAppRegion: 'drag', // Make the title bar draggable
    userSelect: 'none',
    position: 'relative',
    zIndex: 1000,
  },
  titleBarMac: {
    paddingLeft: '80px', // Space for macOS traffic lights
  },
  titleBarContent: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '0 10px',
  },
  logo: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
  title: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
  },
  windowControls: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    WebkitAppRegion: 'no-drag', // Make window controls clickable
  },
  windowButton: {
    width: '46px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  closeButton: {
    '&:hover': {
      backgroundColor: '#e81123',
      color: 'white',
    },
  },
  windowIcon: {
    width: '10px',
    height: '10px',
    display: 'block',
  },
});

const TitleBar: React.FC = () => {
  const styles = useStyles();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Check initial window state
    const checkMaximized = async () => {
      try {
        const maximized = await window.electron.window.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error('Failed to check window state:', error);
      }
    };

    checkMaximized();

    // Listen for window state changes
    const removeListener = window.electron.ipcRenderer.on(
      'window-state-changed',
      (state: any) => {
        if (state && typeof state.isMaximized === 'boolean') {
          setIsMaximized(state.isMaximized);
        }
      }
    );

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  const handleMinimize = () => {
    window.electron.window.minimize();
  };

  const handleMaximize = () => {
    window.electron.window.maximize();
  };

  const handleClose = () => {
    window.electron.window.close();
  };

  return (
    <div className={`${styles.titleBar} ${isMac ? styles.titleBarMac : ''}`}>
      <div className={styles.titleBarContent}>
        <img src="../../../assets/icon.png" alt="True Sight Logo" className={styles.logo} />
        <span className={styles.title}>True Sight 1.0.0 OFBL Unit 5</span>
      </div>
      
      {!isMac && (
        <div className={styles.windowControls}>
          <button 
            className={styles.windowButton} 
            onClick={handleMinimize}
            aria-label="Minimize"
          >
            <svg className={styles.windowIcon} viewBox="0 0 10 1">
              <path d="M0 0h10v1H0z" fill="currentColor" />
            </svg>
          </button>
          
          <button 
            className={styles.windowButton} 
            onClick={handleMaximize}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg className={styles.windowIcon} viewBox="0 0 10 10">
                <path d="M2 1h7v7H2V1zm1 2v4h5V3H3z" fill="currentColor" />
              </svg>
            ) : (
              <svg className={styles.windowIcon} viewBox="0 0 10 10">
                <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
              </svg>
            )}
          </button>
          
          <button 
            className={`${styles.windowButton} ${styles.closeButton}`} 
            onClick={handleClose}
            aria-label="Close"
          >
            <svg className={styles.windowIcon} viewBox="0 0 10 10">
              <path d="M6.4 5l3.3-3.3c0.4-0.4 0.4-1 0-1.4s-1-0.4-1.4 0L5 3.6 1.7 0.3c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4L3.6 5 0.3 8.3c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3L5 6.4l3.3 3.3c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4L6.4 5z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleBar;
