export const routeTitles: Record<string, string> = {
  '/login': 'Login',
  '/': 'Overview',
  '/overview': 'Overview',
  '/workspace': 'Workspace',
  '/shell': 'Shell 105mm',
  '/m107': 'M107',
  '/personnel': 'Personnel',
  '/reports': 'Generate Reports',
  '/settings': 'Settings',
  '/ai-model': 'AI Model',
};

// Function to get route title for dynamic routes
export const getRouteTitle = (path: string): string => {
  // Check if it's a static route
  if (routeTitles[path]) {
    return routeTitles[path];
  }
  
  // Handle dynamic routes
  if (path.match(/^\/workspace\/[^/]+$/)) {
    const shiftId = path.split('/').pop();
    return `Shift ${shiftId} - Workspace`;
  }
  
  // Default fallback
  return 'Page Not Found';
};
