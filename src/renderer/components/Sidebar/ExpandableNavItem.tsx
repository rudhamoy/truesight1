import React, { ReactNode, useState } from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronRight24Regular } from '@fluentui/react-icons';

interface ExpandableNavItemProps {
  id: string;
  icon?: ReactNode;
  label: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  children?: ReactNode;
  isCollapsed?: boolean;
}

const useStyles = makeStyles({
  navItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    position: 'relative',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
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
    flex: 1,
    transition: 'opacity 0.2s, width 0.2s',
    whiteSpace: 'nowrap',
  },
  labelHidden: {
    opacity: 0,
    width: 0,
    overflow: 'hidden',
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s, width 0.2s',
  },
  chevronHidden: {
    opacity: 0,
    width: 0,
    overflow: 'hidden',
  },
  childrenContainer: {
    overflow: 'hidden',
    maxHeight: '0',
    transition: 'max-height 0.3s ease-out',
  },
  expanded: {
    maxHeight: '500px', // Arbitrary large value, will be constrained by content
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

export const ExpandableNavItem: React.FC<ExpandableNavItemProps> = ({
  id,
  icon,
  label,
  isExpanded,
  onToggleExpand,
  children,
  isCollapsed = false,
}) => {
  const styles = useStyles();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={styles.navItem}>
      <div 
        className={styles.header} 
        onClick={onToggleExpand}
        onMouseEnter={() => isCollapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={styles.headerContent}>
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
        </div>
        <span className={mergeClasses(
          styles.chevron,
          isCollapsed && styles.chevronHidden
        )}>
          {isExpanded ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
        </span>
        
        {isCollapsed && showTooltip && (
          <div className={mergeClasses(styles.tooltip, showTooltip && styles.showTooltip)}>
            {label}
          </div>
        )}
      </div>
      {!isCollapsed && (
        <div className={mergeClasses(styles.childrenContainer, isExpanded && styles.expanded)}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                isCollapsed 
              } as any);
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};
