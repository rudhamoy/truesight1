import React, { useState, useEffect } from 'react';
import { 
  makeStyles, 
  Title1, 
  Card, 
  CardHeader, 
  Button, 
  Text,
  Spinner,
  tokens,
  Divider
} from '@fluentui/react-components';
import { 
  FolderRegular, 
  ArrowRightRegular, 
  DismissRegular,
  FolderOpenRegular
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';
import ShiftTable from '../components/ShiftTable/ShiftTable';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    padding: '16px',
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
  },
  cardHeader: {
    paddingBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    gap: '16px',
    textAlign: 'center',
  },
  folderPath: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '4px',
    marginBottom: '16px',
    wordBreak: 'break-all',
  },
  activationContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
    padding: '24px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
  },
  workspaceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '4px',
    marginBottom: '16px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  statusActive: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
  },
  statusInactive: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
  },
});

const Workspace: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  
  // State for workspace
  const [workspaceStatus, setWorkspaceStatus] = useState<{
    path: string;
    isActive: boolean;
  } | null>(null);
  
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  
  // Load workspace status on component mount
  useEffect(() => {
    const loadWorkspaceStatus = async () => {
      try {
        const status = await window.electron.workspace.getStatus();
        setWorkspaceStatus(status);
        
        // If workspace is active, set up dummy data for the table
        if (status?.isActive) {
          setTableData(generateDummyData());
        }
      } catch (err) {
        console.error('Failed to load workspace status:', err);
      }
    };
    
    loadWorkspaceStatus();
    
    // Set up WebSocket listener
    const removeListener = window.electron.websocket.onMessage((data) => {
      console.log('WebSocket data received:', data);
      // In the future, this would update the table data
      // For now, we'll just log it
    });
    
    return () => {
      // Clean up WebSocket listener
      removeListener();
    };
  }, []);
  
  // Generate dummy data for the table
  const generateDummyData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      slNo: i + 1,
      shiftNo: `S00${i + 1}`,
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      totalAnalyze: Math.floor(Math.random() * 50) + 30,
      totalShells: {
        approved: Math.floor(Math.random() * 30) + 10,
        defect: Math.floor(Math.random() * 20),
      },
    }));
  };
  
  // Handle folder selection
  const handleSelectFolder = async () => {
    try {
      const folderPath = await window.electron.workspace.selectFolder();
      if (folderPath) {
        setSelectedFolder(folderPath);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to select folder:', err);
      setError('Failed to select folder');
    }
  };
  
  // Handle workspace activation
  const handleActivateWorkspace = async () => {
    if (!selectedFolder) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await window.electron.workspace.activateWorkspace(selectedFolder);
      
      if (result.success) {
        setWorkspaceStatus(result.workspace);
        setSelectedFolder(null);
        setTableData(generateDummyData());
      } else {
        setError(result.error || 'Failed to activate workspace');
      }
    } catch (err) {
      console.error('Failed to activate workspace:', err);
      setError('Failed to activate workspace');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle closing shift
  const handleCloseShift = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await window.electron.workspace.closeShift();
      
      if (result.success) {
        // Update workspace status
        if (workspaceStatus) {
          setWorkspaceStatus({
            ...workspaceStatus,
            isActive: false
          });
        }
        
        // Clear table data
        setTableData([]);
      } else {
        setError(result.error || 'Failed to close shift');
      }
    } catch (err) {
      console.error('Failed to close shift:', err);
      setError('Failed to close shift');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Table columns configuration
  const columns = [
    {columnKey: 'slNo', label: 'SL.NO', className: 'smallColumn'},
    {columnKey: 'shiftNo', label: 'SHIFT NO'},
    {columnKey: 'date', label: 'DATE'},
    {columnKey: 'totalAnalyze', label: 'TOTAL ANALYZE'},
    {
      columnKey: 'totalShells',
      label: 'TOTAL SHELLS',
      subColumns: [
        {columnKey: 'approved', label: 'APPROVED'},
        {columnKey: 'defect', label: 'DEFECTS'},
      ],
    },
    {columnKey: 'actions', label: '', className: 'actionColumn'},
  ];

  // Table action handlers
  const handleView = (item: any) => {
    navigate(`/workspace/${item.shiftNo}`);
  };

  const handleEdit = (item: any) => {
    console.log('Edit item:', item);
  };

  const handleReAnalyze = (item: any) => {
    console.log('Re-Analyze item:', item);
  };
  
  // Render empty state when no workspace is active
  const renderEmptyState = () => (
    <Card className={styles.card}>
      <div className={styles.emptyState}>
        <FolderRegular fontSize={48} />
        <Title1>No Current Workspace Active</Title1>
        <Text>Select a folder to activate as your workspace</Text>
        <Button appearance="primary" onClick={handleSelectFolder}>
          Select Folder
        </Button>
      </div>
    </Card>
  );
  
  // Render folder selection confirmation
  const renderFolderSelection = () => (
    <Card className={styles.card}>
      <div className={styles.activationContainer}>
        <Title1>Activate Workspace</Title1>
        
        <div className={styles.folderPath}>
          <Text weight="semibold">Selected folder:</Text>
          <Text>{selectedFolder}</Text>
        </div>
        
        {error && (
          <Text style={{ color: tokens.colorPaletteRedForeground1 }}>
            {error}
          </Text>
        )}
        
        <div className={styles.buttonContainer}>
          <Button appearance="secondary" onClick={handleSelectFolder}>
            Change Folder
          </Button>
          <Button 
            appearance="primary" 
            onClick={handleActivateWorkspace}
            icon={<ArrowRightRegular />}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="tiny" /> : 'Activate Workspace'}
          </Button>
        </div>
      </div>
    </Card>
  );
  
  // Render active workspace with shift table
  const renderActiveWorkspace = () => (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <Title1>Shift List</Title1>
        <Button 
          appearance="primary" 
          onClick={handleCloseShift}
          icon={<DismissRegular />}
          disabled={isLoading}
        >
          Close Shift
        </Button>
      </CardHeader>
      
      <div className={styles.workspaceInfo}>
        <FolderOpenRegular />
        <Text weight="semibold">Workspace: </Text>
        <Text>{workspaceStatus?.path}</Text>
        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
          Active
        </span>
      </div>
      
      <ShiftTable 
        data={tableData} 
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onReAnalyze={handleReAnalyze}
      />
    </Card>
  );
  
  // Render inactive workspace
  const renderInactiveWorkspace = () => (
    <Card className={styles.card}>
      <div className={styles.activationContainer}>
        <div className={styles.workspaceInfo}>
          <FolderOpenRegular />
          <Text weight="semibold">Workspace: </Text>
          <Text>{workspaceStatus?.path}</Text>
          <span className={`${styles.statusBadge} ${styles.statusInactive}`}>
            Inactive
          </span>
        </div>
        
        <Text>This workspace is currently inactive. Would you like to reactivate it?</Text>
        
        <div className={styles.buttonContainer}>
          <Button appearance="secondary" onClick={handleSelectFolder}>
            Select Different Folder
          </Button>
          <Button 
            appearance="primary" 
            onClick={() => handleActivateWorkspace()}
            icon={<ArrowRightRegular />}
            disabled={isLoading || !workspaceStatus?.path}
          >
            {isLoading ? <Spinner size="tiny" /> : 'Reactivate Workspace'}
          </Button>
        </div>
      </div>
    </Card>
  );
  
  return (
    <PageContainer title="Workspace">
      <div className={styles.content}>
        <Title1>Workspace</Title1>
        
        {isLoading && !selectedFolder ? (
          <Card className={styles.card}>
            <div className={styles.emptyState}>
              <Spinner />
              <Text>Loading workspace status...</Text>
            </div>
          </Card>
        ) : selectedFolder ? (
          renderFolderSelection()
        ) : workspaceStatus?.isActive ? (
          renderActiveWorkspace()
        ) : workspaceStatus ? (
          renderInactiveWorkspace()
        ) : (
          renderEmptyState()
        )}
      </div>
    </PageContainer>
  );
};

export default Workspace;
