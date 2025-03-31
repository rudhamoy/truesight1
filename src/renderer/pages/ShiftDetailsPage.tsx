import React from 'react';
import { makeStyles, Title1, Card, CardHeader, Button } from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';
import ShellTable from '../components/ShellTable/ShellTable';

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
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

const ShiftDetailsPage: React.FC = () => {
  const styles = useStyles();
  const { shiftId } = useParams<{ shiftId: string }>();
  const navigate = useNavigate();
  
  // Sample data - in a real app, this would come from an API or state
  const items = [
    {
      slNo: 1,
      plateNo: 123,
      shellNo: 432,
      zeroOrientation: 'PA',
      ninetyOrientation: 'PA',
      remarks: 'NA',
    },
    {
      slNo: 2,
      plateNo: 124,
      shellNo: 433,
      zeroOrientation: 'PA',
      ninetyOrientation: 'PA',
      remarks: 'NA',
    },
  ];

  const columns = [
    { columnKey: "slNo", label: "SL.NO", className: "smallColumn" },
    { columnKey: "plateNo", label: "PLATE SL.NO" },
    { columnKey: "shellNo", label: "SHELL SL.NO" },
    { columnKey: "zeroOrientation", label: "0 ORIENTATION" },
    { columnKey: "ninetyOrientation", label: "90 ORIENTATION" },
    { columnKey: "remarks", label: "REMARKS" },
    { columnKey: "actions", label: "", className: "actionColumn" },
  ];

  const handleBack = () => {
    navigate('/workspace');
  };
  
  return (
    <PageContainer title={`Shift ${shiftId} - Workspace`}>
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <Title1>Shift {shiftId} Details</Title1>
          <Button 
            appearance="subtle" 
            icon={<ArrowLeft24Regular />}
            onClick={handleBack}
            className={styles.backButton}
          >
            Back to Shift List
          </Button>
        </div>
        
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <Title1>Shell List</Title1>
          </CardHeader>
          
          <ShellTable 
            data={items} 
            columns={columns}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default ShiftDetailsPage;
