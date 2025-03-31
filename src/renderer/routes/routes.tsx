import React from 'react';
import { RouteObject } from 'react-router-dom';
import Overview from '../pages/Overview';
import ShellLotList from '../pages/ShellLotList';
import ShiftDetailsPage from '../pages/ShiftDetailsPage';
import M107LotList from '../pages/M107LotList';
import Workspace from '../pages/Workspace';
import Personnel from '../pages/Personnel';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import AIModel from '../pages/AIModel';
import PageContainer from '../pages/PageContainer';
import Login from '../pages/Login';

// Placeholder component for routes not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <PageContainer>
    <div style={{ padding: '24px' }}>
      <h1>{title}</h1>
      <p>This page is not yet implemented.</p>
    </div>
  </PageContainer>
);

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Overview />,
  },
  {
    path: '/overview',
    element: <Overview />,
  },
  {
    path: '/workspace',
    element: <Workspace />,
  },
  {
    path: '/shell',
    element: <ShellLotList />,
  },
  {
    path: '/workspace/:shiftId',
    element: <ShiftDetailsPage />,
  },
  {
    path: '/m107',
    element: <M107LotList />,
  },
  {
    path: '/personnel',
    element: <Personnel />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/ai-model',
    element: <AIModel />,
  },
  {
    path: '*',
    element: <PlaceholderPage title="Page Not Found" />,
  },
];
