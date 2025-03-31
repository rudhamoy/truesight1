import React from 'react';
import { makeStyles, Title1, Card, CardHeader } from '@fluentui/react-components';
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
  },
});

const ShellCurrentLot: React.FC = () => {
  const styles = useStyles();
  
  // Sample data - in a real app, this would come from an API or state
  const items = [
    {
      slNo: 1,
      shiftNo: 'S001',
      date: '2025-02-24',
      totalAnalyze: 50,
      totalShells: {approved: 30, defect: 20},
    },
    {
      slNo: 2,
      shiftNo: 'S002',
      date: '2025-02-23',
      totalAnalyze: 40,
      totalShells: {approved: 25, defect: 15},
    },
  ];

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

  const handleView = (item: any) => {
    console.log('View item:', item);
  };

  const handleEdit = (item: any) => {
    console.log('Edit item:', item);
  };

  const handleReAnalyze = (item: any) => {
    console.log('Re-Analyze item:', item);
  };
  
  return (
    <PageContainer title="Current Lot - Shell 105mm">
      <div className={styles.content}>
        <Title1>Shell 105mm - Current Lot</Title1>
        
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <Title1>Shift List</Title1>
          </CardHeader>
          
          <ShiftTable 
            data={items} 
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onReAnalyze={handleReAnalyze}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default ShellCurrentLot;
