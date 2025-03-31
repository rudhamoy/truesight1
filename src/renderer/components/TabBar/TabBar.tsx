import React from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';
import { useTabs, Tab } from '../../context/TabsContext';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
  tabBar: {
    display: 'flex',
    backgroundColor: '#f3f3f3',
    borderBottom: '1px solid #e0e0e0',
    height: '36px',
    overflow: 'auto',
    userSelect: 'none',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: '2px',
    },
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    minWidth: '120px',
    maxWidth: '200px',
    height: '100%',
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#ececec',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#e5e5e5',
    },
    '&:hover $closeButton': {
      opacity: 1,
    },
  },
  activeTab: {
    backgroundColor: 'white',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#0078d4',
    },
  },
  tabTitle: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    marginLeft: '4px',
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.2s, background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      opacity: 1,
    },
  },
  emptyTabBar: {
    height: '36px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f3f3f3',
  },
});

const TabBar: React.FC = () => {
  const styles = useStyles();
  const { tabs, activateTab, closeTab } = useTabs();
  const { isAuthenticated } = useAuth();
  
  // If not authenticated or there are no tabs, render an empty tab bar or nothing
  if (!isAuthenticated) {
    return null;
  }
  
  if (tabs.length === 0) {
    return <div className={styles.emptyTabBar} />;
  }

  const handleTabClick = (tabId: string) => {
    activateTab(tabId);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // Prevent tab activation when closing
    closeTab(tabId);
  };

  return (
    <div className={styles.tabBar}>
      {tabs.map((tab: Tab) => (
        <div
          key={tab.id}
          className={mergeClasses(
            styles.tab,
            tab.isActive && styles.activeTab
          )}
          onClick={() => handleTabClick(tab.id)}
          title={tab.title}
        >
          <span className={styles.tabTitle}>{tab.title}</span>
          <button
            className={styles.closeButton}
            onClick={(e) => handleCloseTab(e, tab.id)}
            title="Close"
          >
            <Dismiss12Regular />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TabBar;
