import React, { ReactNode } from 'react';
import { makeStyles } from '@fluentui/react-components';
import Header from '../components/Header/Header';

interface PageContainerProps {
  title?: string;
  children?: ReactNode;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    padding: '24px',
    flex: 1,
    overflow: 'auto',
  },
});

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.container}>
      <Header title={title} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
