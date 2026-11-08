// frontend/src/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import api from './api';

export const AdminDashboard: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    api.get('/attendance/all').then(res => setRecords(res.data)).catch(console.error);
  }, []);

  return (
    <div className="card">
      <h2>Attendance Logs</h2>
      <table>
        <thead>
          <tr><th>Time (WIB)</th><th>Employee</th><th>Type</th><th>Photo</th></tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                {new Date(record.timestamp).toLocaleString('id-ID', {
                  timeZone: 'Asia/Jakarta',
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </td>
              <td>
                <strong>{record.employeeName}</strong><br/>
                <span className="text-sm">ID: #{record.employeeId}</span>
              </td>
              <td style={{ color: record.type === 'IN' ? 'var(--primary)' : 'var(--danger)', fontWeight: 600 }}>
                {record.type}
              </td>
              <td>
                <img src={record.photoUrl} alt="Check-in" style={{ width: '60px', borderRadius: '4px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};