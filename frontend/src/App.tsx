// frontend/src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { Attendance } from './Attendance';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeManager } from './EmployeeManager';

const Login = () => {
  const { login } = useAuth();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Add state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(u, p);
    } catch (err: any) {
      setError('Incorrect username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '2.25rem', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          HR Portal
        </h1>
        <p className="text-sm">Sign in to access your workspace</p>
      </div>

      <form className="card" onSubmit={handleSubmit} style={{ width: '350px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem' }}>Sign In</h2>
        
        {error && (
          <div style={{ 
            marginBottom: '1rem', padding: '0.75rem', borderRadius: 'var(--radius)', 
            backgroundColor: '#fee2e2', color: 'var(--danger)', fontSize: '0.875rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <input 
          placeholder="Username" 
          value={u} 
          onChange={e => setU(e.target.value)} 
          required 
        />

        {/* 2. Wrap the password input and add the toggle button */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            value={p} 
            onChange={e => setP(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: 0, paddingRight: '40px' }} // Prevent text from hiding behind the icon
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', padding: '4px',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              // Eye icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        
        <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('camera');

  return (
    <div>
      <nav className="navbar flex-between">
        <div className="flex-gap">
          <h3 style={{ margin: 0 }}>HR Portal</h3>
          <div className="nav-links flex-gap">
            <button className={activeTab === 'camera' ? 'active' : ''} onClick={() => setActiveTab('camera')}>Camera</button>
            {user?.role === 'Admin' && (
              <>
                <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>Logs</button>
                <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>Employees</button>
              </>
            )}
          </div>
        </div>
        <div className="flex-gap">
          <span className="text-sm">{user?.firstName} ({user?.role})</span>
          <button className="outline" onClick={logout}>Log Out</button>
        </div>
      </nav>

      <main className="container">
        {activeTab === 'camera' && <Attendance />}
        {activeTab === 'logs' && user?.role === 'Admin' && <AdminDashboard />}
        {activeTab === 'employees' && user?.role === 'Admin' && <EmployeeManager />}
      </main>
    </div>
  );
};

const Main = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Login />;
};

export default function App() {
  return <AuthProvider><Main /></AuthProvider>;
}