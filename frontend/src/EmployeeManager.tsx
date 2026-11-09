// frontend/src/EmployeeManager.tsx
import React, { useState, useEffect } from 'react';
import api from './api';

export const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ username: '', password: '', firstName: '', lastName: '', division: '', roleName: 'Staff' });

  const fetchEmployees = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/employees/${editingId}`, form);
      } else {
        await api.post('/employees', form);
      }
      setForm({ username: '', password: '', firstName: '', lastName: '', division: '', roleName: 'Staff' });
      setEditingId(null);
      fetchEmployees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving employee');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  const editEmployee = (emp: any) => {
    setEditingId(emp.accountId);
    setForm({ username: emp.username, password: '', firstName: emp.firstName, lastName: emp.lastName, division: emp.division, roleName: emp.role });
  };

  const handleCancel = () => {
    setEditingId(null);
    // Clear the form fields back to their defaults
    setForm({ username: '', password: '', firstName: '', lastName: '', division: '', roleName: 'Staff' });
  };

  return (
    <div className="card">
      <div className="flex-between">
        <h2>Employee Management</h2>
        {editingId && <button className="outline" onClick={handleCancel}>Cancel Edit</button>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
        <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
        <input type="text" placeholder="Division" value={form.division} onChange={e => setForm({...form, division: e.target.value})} required />
        <select value={form.roleName} onChange={e => setForm({...form, roleName: e.target.value})}>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>
        {!editingId && <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />}
        {!editingId && <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />}
        <button type="submit" style={{ height: '42px' }}>{editingId ? 'Update Employee' : 'Create Employee'}</button>
      </form>

      <table>
        <thead><tr><th>Name</th><th>Username</th><th>Division</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.accountId}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.username}</td>
              <td>{emp.division}</td>
              <td>{emp.role}</td>
              <td className="flex-gap">
                <button className="outline" onClick={() => editEmployee(emp)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(emp.accountId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};