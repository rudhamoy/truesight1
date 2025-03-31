import React, { ReactNode, useState } from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

interface NavItemProps {
  icon?: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  indented?: boolean;
  isCollapsed?: boolean;
}

const useStyles = makeStyles({
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  active: {
    backgroundColor: '#d0d0d0',
    borderLeft: '4px solid #0078d4',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  },
  icon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
  },
  iconCentered: {
    marginRight: 0,
  },
  label: {
    fontSize: '14px',
    transition: 'opacity 0.2s, width 0.2s',
    whiteSpace: 'nowrap',
  },
  labelHidden: {
    opacity: 0,
    width: 0,
    overflow: 'hidden',
  },
  indented: {
    paddingLeft: '48px',
  },
  indentedCollapsed: {
    paddingLeft: '16px',
  },
  tooltip: {
    position: 'absolute',
    left: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    zIndex: 100,
    marginLeft: '10px',
    display: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s ease',
    opacity: 0,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '-6px',
      marginTop: '-6px',
      border: '6px solid transparent',
      borderRightColor: 'rgba(0, 0, 0, 0.8)',
    }
  },
  showTooltip: {
    display: 'block',
    opacity: 1,
  },
});

export const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  isActive = false, 
  onClick,
  indented = false,
  isCollapsed = false,
}) => {
  const styles = useStyles();
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className={mergeClasses(
        styles.navItem, 
        isActive && styles.active,
        indented && (isCollapsed ? styles.indentedCollapsed : styles.indented)
      )}
      onClick={onClick}
      onMouseEnter={() => isCollapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: 'relative' }}
    >
      {icon && (
        <span className={mergeClasses(
          styles.icon,
          isCollapsed && styles.iconCentered
        )}>
          {icon}
        </span>
      )}
      <span className={mergeClasses(
        styles.label,
        isCollapsed && styles.labelHidden
      )}>
        {label}
      </span>
      
      {isCollapsed && showTooltip && (
        <div className={mergeClasses(styles.tooltip, showTooltip && styles.showTooltip)}>
          {label}
        </div>
      )}
    </div>
  );
};
