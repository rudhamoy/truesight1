import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, Button, mergeClasses } from '@fluentui/react-components';
import { NavItem } from './NavItem';
import { ExpandableNavItem } from './ExpandableNavItem';
import { 
  Home24Regular, 
  ShieldTask24Regular, 
  People24Regular, 
  DocumentText24Regular, 
  BrainCircuit24Regular, 
  Settings24Regular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
  Document24Regular
} from '@fluentui/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTabs } from '../../context/TabsContext';
import { routeTitles } from '../../utils/routeTitles';

const useStyles = makeStyles({
  sidebar: {
    height: '100%',
    backgroundColor: '#f3f3f3',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    position: 'relative',
    userSelect: 'none', // Prevent text selection during resize
    transition: 'width 0.3s ease',
  },
  sidebarCollapsed: {
    width: '64px !important',
  },
  resizeHandle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '4px',
    height: '100%',
    cursor: 'ew-resize',
    zIndex: 10,
    '&:hover': {
      backgroundColor: '#0078d4',
    },
    '&:active': {
      backgroundColor: '#0078d4',
    },
  },
  resizing: {
    transition: 'none', // Disable transition during resize for smoother dragging
    userSelect: 'none',
  },
  logo: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid #e0e0e0',
  },
  logoImage: {
    width: '24px',
    height: '24px',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'opacity 0.3s ease',
    whiteSpace: 'nowrap',
  },
  hidden: {
    opacity: 0,
    width: 0,
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  settingsContainer: {
    marginTop: 'auto',
    borderTop: '1px solid #e0e0e0',
  },
  toggleButton: {
    position: 'absolute',
    top: '10px',
    right: '-12px',
    zIndex: 10,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: 0,
    minWidth: 'unset',
  },
});

const Sidebar: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Track collapsed state for the sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Track custom width for the sidebar
  const [width, setWidth] = useState(300);
  
  // Track if the sidebar is being resized
  const [isResizing, setIsResizing] = useState(false);
  
  // Track expanded state for expandable items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'shell': true,
    'm107': false,
    'ai-model': false,
  });

  // Constants for min and max width
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 500;
  const COLLAPSED_WIDTH = 64;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleExpanded = (id: string) => {
    if (!isCollapsed) {
      setExpandedItems(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  const { tabs, activeTabId, addTab, updateTab, activateTab, getTabParentId } = useTabs();

  // Determine if a new tab should be opened based on the path and parent ID
  const shouldOpenNewTab = (path: string): boolean => {
    // If there are no tabs, always open a new tab
    if (tabs.length === 0) return true;

    // Get the parent ID for the current path
    const pathParentId = getTabParentId(path);

    // If there's no active tab, open a new tab
    if (!activeTabId) return true;

    // Find the active tab
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return true;

    // Get the parent ID for the active tab
    const activeTabParentId = activeTab.parentId;

    // If the path is a main route (no parent ID), always open a new tab
    if (!pathParentId) return true;

    // If the active tab and the new path have different parent IDs, open a new tab
    if (pathParentId !== activeTabParentId) return true;

    // Otherwise, replace the content in the current tab
    return false;
  };

  const handleNavigation = (path: string) => {
    // Check if a tab for this path already exists
    const existingTab = tabs.find(tab => tab.path === path);
    if (existingTab) {
      // If a tab for this path already exists, just activate it
      activateTab(existingTab.id);
      return;
    }
    
    const title = routeTitles[path] || 'Untitled';
    const parentId = getTabParentId(path);

    if (shouldOpenNewTab(path)) {
      // Open a new tab
      addTab({
        id: Math.random().toString(36).substring(2, 9),
        title,
        path,
        parentId,
      });
    } else {
      // Find the active tab and update it
      const activeTab = tabs.find(tab => tab.isActive);
      if (activeTab) {
        updateTab(activeTab.id, {
          title,
          path,
          parentId,
        });
      }
      
      // Navigate to the path
      navigate(path);
    }
  };

  // Handle mouse down on resize handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    // Add event listeners for mouse move and mouse up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse move during resize
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    // Calculate new width based on mouse position
    let newWidth = e.clientX;
    
    // Apply constraints
    if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
    if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
    
    // Update width
    setWidth(newWidth);
    
    // Apply width to sidebar element
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  };

  // Handle mouse up after resize
  const handleMouseUp = () => {
    setIsResizing(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Handle double click on resize handle to reset width
  const handleDoubleClick = () => {
    setWidth(300); // Reset to default width
    
    if (sidebarRef.current) {
      sidebarRef.current.style.width = '300px';
    }
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={sidebarRef}
      className={mergeClasses(
        styles.sidebar, 
        isCollapsed && styles.sidebarCollapsed,
        isResizing && styles.resizing
      )}
      style={{ width: isCollapsed ? COLLAPSED_WIDTH : width }}
    >
      <Button 
        className={styles.toggleButton}
        onClick={toggleSidebar}
        icon={isCollapsed ? <ChevronRight24Regular /> : <ChevronLeft24Regular />}
      />
      
      {!isCollapsed && (
        <div 
          className={styles.resizeHandle} 
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        />
      )}
      
      <div className={styles.nav}>
        <NavItem 
          icon={<Home24Regular />} 
          label="Overview" 
          isActive={location.pathname === '/overview'}
          onClick={() => handleNavigation('/overview')}
          isCollapsed={isCollapsed}
        />
        
        <NavItem 
          icon={<Document24Regular />} 
          label="Workspace" 
          isActive={location.pathname === '/workspace' || location.pathname.startsWith('/workspace/')}
          onClick={() => handleNavigation('/workspace')}
          isCollapsed={isCollapsed}
        />
        
        <NavItem 
          icon={<ShieldTask24Regular />} 
          label="Shell 105mm" 
          isActive={location.pathname === '/shell'}
          onClick={() => handleNavigation('/shell')}
          isCollapsed={isCollapsed}
        />
        
        <NavItem 
          icon={<ShieldTask24Regular />} 
          label="M107" 
          isActive={location.pathname === '/m107'}
          onClick={() => handleNavigation('/m107')}
          isCollapsed={isCollapsed}
        />
        
        <NavItem 
          icon={<People24Regular />} 
          label="Personnel" 
          isActive={location.pathname === '/personnel'}
          onClick={() => handleNavigation('/personnel')}
          isCollapsed={isCollapsed}
        />
        
        <NavItem 
          icon={<DocumentText24Regular />} 
          label="Generate Reports" 
          isActive={location.pathname === '/reports'}
          onClick={() => handleNavigation('/reports')}
          isCollapsed={isCollapsed}
        />
        
        <NavItem 
          icon={<BrainCircuit24Regular />} 
          label="AI Model" 
          isActive={location.pathname === '/ai-model'}
          onClick={() => handleNavigation('/ai-model')}
          isCollapsed={isCollapsed}
        />
      </div>
      
      <div className={styles.settingsContainer}>
        <NavItem 
          icon={<Settings24Regular />} 
          label="Settings" 
          isActive={location.pathname === '/settings'}
          onClick={() => handleNavigation('/settings')}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;
