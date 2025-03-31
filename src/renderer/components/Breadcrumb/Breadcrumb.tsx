import React from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Home24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import { useLocation, Link } from 'react-router-dom';
import { routeTitles, getRouteTitle } from '../../utils/routeTitles';

interface BreadcrumbProps {
  title?: string;
}

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast?: boolean;
}

const useStyles = makeStyles({
  breadcrumb: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#0078d4',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  breadcrumbItem: {
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumbLink: {
    color: '#0078d4',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  breadcrumbText: {
    color: '#333',
    fontWeight: 'bold',
  },
  separator: {
    margin: '0 8px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
  },
});

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => {
  const styles = useStyles();
  const location = useLocation();
  const path = location.pathname;
  
  // Generate breadcrumb items based on the current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    // Default breadcrumb for home
    if (path === '/' || path === '/overview') {
      return [{ label: 'Overview', path: '/overview', isLast: true }];
    }
    
    // Handle Shell 105mm Current Lot nested route || 
    // if (path.match(/^\/shell\/workspace\/current-lot\/[^/]+$/)) {
    if (path.match(/^\/workspace\/[^/]+$/)) {
      const shiftId = path.split('/').pop() || '';
      return [
        // { label: 'Shell 105mm', path: '/shell/lot-list' },
        // { label: 'Current Lot', path: '/shell/current-lot' },
        { label: 'Workspace', path: '/workspace' },
        { label: `Shift ${shiftId}`, path, isLast: true },
      ];
    }
    
    // Handle other Shell 105mm routes
    if (path.startsWith('/shell/')) {
      const pathParts = path.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      let label = '';
      if (lastPart === 'lot-list') {
        label = 'Lot List';
      } else if (lastPart === 'current-lot') {
        label = 'Current Lot';
      } else if (lastPart === 'create-lot') {
        label = 'Create New Lot';
      }
      
      return [
        { label: 'Shell 105mm', path: '/shell/lot-list' },
        { label, path, isLast: true },
      ];
    }
    
    // Handle M107 routes
    if (path.startsWith('/m107/')) {
      const pathParts = path.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      let label = '';
      if (lastPart === 'lot-list') {
        label = 'Lot List';
      } else if (lastPart === 'current-lot') {
        label = 'Current Lot';
      } else if (lastPart === 'create-lot') {
        label = 'Create New Lot';
      }
      
      return [
        { label: 'M107', path: '/m107/lot-list' },
        { label, path, isLast: true },
      ];
    }
    
    // Default for other routes
    return [{ label: title || getRouteTitle(path), path, isLast: true }];
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  return (
    <div className={styles.breadcrumb}>
      <span className={styles.icon}>
        <Home24Regular />
      </span>
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className={styles.breadcrumbItem}>
          {index > 0 && (
            <span className={styles.separator}>
              <ChevronRight24Regular />
            </span>
          )}
          
          {item.isLast ? (
            <span className={styles.breadcrumbText}>{item.label}</span>
          ) : (
            <Link to={item.path} className={styles.breadcrumbLink}>
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
