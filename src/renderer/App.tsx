import { MemoryRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import './App.css';
import Layout from './components/Layout/Layout';
import { routes } from './routes/routes';
import { TabsProvider } from './context/TabsContext';
import { AuthProvider } from './context/AuthContext';

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Router>
        <AuthProvider>
          <TabsProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </TabsProvider>
        </AuthProvider>
      </Router>
    </FluentProvider>
  );
}
