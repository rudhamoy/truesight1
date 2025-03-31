import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routeTitles, getRouteTitle } from '../utils/routeTitles';
import { useAuth } from './AuthContext';

export interface Tab {
  id: string;
  title: string;
  path: string;
  parentId?: string;
  isActive: boolean;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, 'isActive'>) => void;
  closeTab: (tabId: string) => void;
  activateTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Omit<Tab, 'id'>>) => void;
  getTabParentId: (path: string) => string | undefined;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Helper function to extract parent ID from path
const getParentIdFromPath = (path: string): string | undefined => {
  // Use the full path as the parent ID to ensure each route gets its own tab
  // Except for dynamic routes with parameters
  
  // Handle workspace/:shiftId route
  if (path.match(/^\/workspace\/[^/]+$/)) {
    return 'workspace';
  }
  
  return path;
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Clear tabs when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setTabs([]);
      setActiveTabId(null);
    }
  }, [isAuthenticated]);

  // Initialize with the current route when the user is authenticated
  useEffect(() => {
    if (isAuthenticated && tabs.length === 0 && location.pathname && location.pathname !== '/login') {
      const title = getRouteTitle(location.pathname);
      const parentId = getParentIdFromPath(location.pathname);
      const newTab: Tab = {
        id: generateId(),
        title,
        path: location.pathname,
        parentId,
        isActive: true,
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [location.pathname, tabs.length, isAuthenticated]);

  // Update active tab when route changes
  useEffect(() => {
    if (!isAuthenticated || !location.pathname || location.pathname === '/login') return;
    
    // Find if there's a tab for the current path
    const existingTab = tabs.find(tab => tab.path === location.pathname);
    
    if (existingTab) {
      // If the tab exists but is not active, activate it immediately
      if (!existingTab.isActive) {
        // Update all tabs at once to avoid multiple renders
        setTabs(tabs.map(tab => ({
          ...tab,
          isActive: tab.id === existingTab.id
        })));
        setActiveTabId(existingTab.id);
      }
    } else if (tabs.length > 0 && location.pathname !== '/') {
      // If no tab exists for this path and it's not the root path,
      // update the active tab's path
      const activeTab = tabs.find(tab => tab.isActive);
      if (activeTab) {
        const title = getRouteTitle(location.pathname);
        const parentId = getParentIdFromPath(location.pathname);
        
        // Update in a single operation
        setTabs(tabs.map(tab => 
          tab.id === activeTab.id 
            ? { ...tab, title, path: location.pathname, parentId } 
            : tab
        ));
      }
    }
  }, [location.pathname, tabs, activeTabId, isAuthenticated, routeTitles]);
  

  const addTab = (tab: Omit<Tab, 'isActive'>) => {
    // First, deactivate all tabs
    const updatedTabs = tabs.map(t => ({ ...t, isActive: false }));
    
    // Then add the new tab as active
    const newTab: Tab = { ...tab, isActive: true };
    setTabs([...updatedTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    // If we're closing the active tab, we need to activate another one
    if (tabId === activeTabId) {
      const tabIndex = tabs.findIndex(tab => tab.id === tabId);
      
      // If there's a tab to the right, activate it
      // Otherwise, activate the tab to the left (if any)
      const newActiveIndex = tabIndex < tabs.length - 1 
        ? tabIndex + 1 
        : (tabIndex > 0 ? tabIndex - 1 : -1);
      
      if (newActiveIndex >= 0) {
        const newActiveTab = tabs[newActiveIndex];
        setActiveTabId(newActiveTab.id);
        
        // Update tabs with the new active tab
        const updatedTabs = tabs
          .filter(tab => tab.id !== tabId)
          .map(tab => ({
            ...tab,
            isActive: tab.id === newActiveTab.id
          }));
        
        setTabs(updatedTabs);
        
        // Navigate to the new active tab's path
        navigate(newActiveTab.path);
      } else {
        // If there are no more tabs, navigate to home
        setTabs([]);
        setActiveTabId(null);
        navigate('/');
      }
    } else {
      // If we're not closing the active tab, just remove it
      setTabs(tabs.filter(tab => tab.id !== tabId));
    }
  };

  const activateTab = (tabId: string) => {
    const updatedTabs = tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }));
    
    setTabs(updatedTabs);
    setActiveTabId(tabId);
    
    // Navigate to the activated tab's path
    const activatedTab = tabs.find(tab => tab.id === tabId);
    if (activatedTab) {
      navigate(activatedTab.path);
    }
  };

  const updateTab = (tabId: string, updates: Partial<Omit<Tab, 'id'>>) => {
    const updatedTabs = tabs.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    );
    setTabs(updatedTabs);
  };

  const getTabParentId = (path: string): string | undefined => {
    return getParentIdFromPath(path);
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        closeTab,
        activateTab,
        updateTab,
        getTabParentId,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};
