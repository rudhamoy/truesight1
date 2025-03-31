import React, { ReactNode } from 'react';
import { makeStyles } from '@fluentui/react-components';
import Sidebar from '../Sidebar/Sidebar';
import TabBar from '../TabBar/TabBar';
import TitleBar from '../TitleBar/TitleBar';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: 'calc(100vh - 32px)', // Subtract titlebar height
    width: '100vw',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const styles = useStyles();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // If the user is not authenticated, render only the children (which should be the login page)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // If authenticated, render the full layout with titlebar, sidebar and tabs
  return (
    <>
      <TitleBar />
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <TabBar />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
