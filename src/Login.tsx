import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from './supabaseClient.ts';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate(redirectTo);
      }
    };
    checkUser();
  }, [navigate, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setMessage('Login successful! Redirecting...');
        // Small delay to show success message
        setTimeout(() => {
          navigate(redirectTo);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      width: '100%',
    },
    title: {
      marginTop: 0,
      marginBottom: '30px',
      color: '#333',
      textAlign: 'center' as const,
      fontSize: '24px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '5px',
    },
    label: {
      color: '#555',
      fontWeight: '500' as const,
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      transition: 'border-color 0.2s',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
      marginTop: '10px',
    },
    button: {
      padding: '12px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontWeight: '500' as const,
    },
    primaryButton: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
    disabledButton: {
      opacity: 0.6,
      cursor: 'not-allowed' as const,
    },
    message: {
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
    errorMessage: {
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      color: '#c33',
    },
    successMessage: {
      backgroundColor: '#efe',
      border: '1px solid #cfc',
      color: '#3c3',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign In</h1>
        
        {error && (
          <div style={{ ...styles.message, ...styles.errorMessage }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ ...styles.message, ...styles.successMessage }}>
            {message}
          </div>
        )}

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              style={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(loading ? styles.disabledButton : {})
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
          <p>
            Need to go back? <button 
              onClick={() => navigate('/')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Return to main app
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;