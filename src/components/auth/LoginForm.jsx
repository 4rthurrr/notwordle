import React, { useState } from 'react';
import { loginUser, loginWithGoogle } from '../../services/authService';
import './AuthForms.css';

function LoginForm({ onClose, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    const { user, error } = await loginUser(email, password);
    
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    // Login successful
    setLoading(false);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    const { user, error } = await loginWithGoogle();
    
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    // Login successful
    setLoading(false);
    onClose();
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button" 
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      
      <div className="auth-divider">or</div>
      
      <button 
        onClick={handleGoogleLogin}
        className="google-button" 
        disabled={loading}
      >
        Continue with Google
      </button>
      
      <p className="auth-switch">
        Don't have an account? 
        <button 
          onClick={switchToRegister}
          className="text-button"
          disabled={loading}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
