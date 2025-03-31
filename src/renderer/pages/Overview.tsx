import React from 'react';
import { makeStyles, Text, Title1 } from '@fluentui/react-components';
import PageContainer from './PageContainer';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

const Overview: React.FC = () => {
  const styles = useStyles();
  
  return (
    <PageContainer>
      <div className={styles.content}>
        <Title1>Welcome to True Sight</Title1>
        <Text>This is the overview page of the True Sight application.</Text>
      </div>
    </PageContainer>
  );
};

export default Overview;
