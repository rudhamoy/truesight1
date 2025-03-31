import React from 'react';
import { makeStyles, Button } from '@fluentui/react-components';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { SignOut24Regular } from '@fluentui/react-icons';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title?: string;
}

const useStyles = makeStyles({
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px 0 0', // Right padding only, left padding is handled by Breadcrumb
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
});

const Header: React.FC<HeaderProps> = ({ title }) => {
  const styles = useStyles();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Breadcrumb title={title} />
        <div className={styles.actions}>
          {user && (
            <Button 
              appearance="subtle"
              icon={<SignOut24Regular />}
              onClick={handleLogout}
              title="Logout"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
