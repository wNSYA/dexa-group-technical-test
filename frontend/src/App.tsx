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
  
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form className="card" onSubmit={(e) => { e.preventDefault(); login(u, p); }} style={{ width: '350px' }}>
        <h2 style={{ textAlign: 'center' }}>Sign In</h2>
        <input placeholder="Username" value={u} onChange={e => setU(e.target.value)} />
        <input type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} />
        <button type="submit" style={{ width: '100%' }}>Log In</button>
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