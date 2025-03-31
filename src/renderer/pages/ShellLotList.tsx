import React from 'react';
import { makeStyles, Text, Title1 } from '@fluentui/react-components';
import PageContainer from './PageContainer';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  placeholder: {
    padding: '24px',
    backgroundColor: '#f5f5f5',
    border: '1px dashed #ccc',
    borderRadius: '4px',
    textAlign: 'center',
  },
});

const ShellLotList: React.FC = () => {
  const styles = useStyles();
  
  return (
    <PageContainer>
      <div className={styles.content}>
        <Title1>Shell 105mm - Lot List</Title1>
        <div className={styles.placeholder}>
          <Text>Table content will be implemented in the future.</Text>
        </div>
      </div>
    </PageContainer>
  );
};

export default ShellLotList;
