import React, { useState } from 'react';
import { 
  makeStyles, 
  Input, 
  Button, 
  Title1, 
  Text, 
  Card, 
  CardHeader, 
  CardFooter 
} from '@fluentui/react-components';
import { 
  Eye24Regular, 
  EyeOff24Regular, 
  LockClosed24Regular, 
  Person24Regular 
} from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';
import TitleBar from '../components/TitleBar/TitleBar';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '400px',
    maxWidth: '90%',
    padding: '20px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '48px',
    color: '#0078d4',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
  },
  input: {
    width: '100%',
    paddingLeft: '40px',
  },
  passwordToggle: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',
    color: '#666',
  },
  loginButton: {
    marginTop: '16px',
  },
  error: {
    color: '#d13438',
    marginTop: '8px',
    fontSize: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
  },
  helpText: {
    fontSize: '14px',
    color: '#666',
  },
});

const Login: React.FC = () => {
  const styles = useStyles();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <>
      <TitleBar />
      <div className={styles.container} style={{ height: 'calc(100vh - 32px)' }}>
        <Card className={styles.card}>
          <CardHeader className={styles.header}>
            <Title1>True Sight</Title1>
            <Text>Sign in to continue</Text>
          </CardHeader>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <Person24Regular className={styles.icon} />
              <Input
                className={styles.input}
                placeholder="Username"
                value={username}
                onChange={(e, data) => setUsername(data.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.inputWrapper}>
              <LockClosed24Regular className={styles.icon} />
              <Input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e, data) => setPassword(data.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff24Regular /> : <Eye24Regular />}
              </button>
            </div>
            
            {error && <Text className={styles.error}>{error}</Text>}
            
            <Button 
              className={styles.loginButton} 
              appearance="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <CardFooter className={styles.footer}>
            <Text className={styles.helpText}>
              Demo credentials: admin/admin123 or user/user123
            </Text>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;
