// frontend/src/Attendance.tsx
import React, { useEffect, useRef, useState } from 'react';
import api from './api';

export const Attendance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [lastRecord, setLastRecord] = useState<any>(null);
  
  const fetchStatus = async () => {
    try {
      const response = await api.get('/attendance/status');
      setLastRecord(response.data || null); // null means no records yet
    } catch (err) {
      console.error("Failed to fetch attendance status");
    }
  };
  useEffect(() => {
    fetchStatus();
  }, []);  
  
  // Start the webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setMessage('');
      }
    } catch (err) {
      setMessage('Error accessing camera. Please allow camera permissions.');
    }
  };

  // Stop the webcam to free up memory
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  };

  // Cleanup camera if component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleCheckIn = async (type: 'IN' | 'OUT') => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setMessage('');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) { setMessage('Failed to capture image.'); setLoading(false); return; }

      const formData = new FormData();
      formData.append('type', type);
      formData.append('photo', blob, `checkin-${Date.now()}.jpg`);

      try {
        await api.post('/attendance/check-in', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const formattedTime = new Date().toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'medium',
        });
        setMessage(`Successfully clocked ${type} at ${formattedTime}`);
        
        stopCamera(); 
        fetchStatus(); 
        
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Check-in failed');
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
<div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Live Check-in</h2>
      <p className="text-sm" style={{ marginBottom: '1.5rem' }}>
        Ensure your face is clearly visible before clocking in.
      </p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        {!isCameraOn ? (
          <button onClick={startCamera}>Enable Camera</button>
        ) : (
          <button className="outline" onClick={stopCamera}>Turn Off Camera</button>
        )}
      </div>

      {/* Live Video Feed container */}
      <div style={{ 
        width: '100%', 
        borderRadius: 'var(--radius)', 
        overflow: 'hidden', 
        backgroundColor: '#000',
        display: isCameraOn ? 'block' : 'none',
        marginBottom: '1.5rem'
      }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* 4. Determine button visibility based on the database status */}
        {isCameraOn && (
            <div className="flex-gap" style={{ justifyContent: 'center' }}>
            {/* Show IN if there are no records OR the last record was an OUT */}
            {(!lastRecord || lastRecord.type === 'OUT') && (
                <button 
                disabled={loading} 
                onClick={() => handleCheckIn('IN')}
                style={{ flex: 1, backgroundColor: 'var(--primary)' }}
                >
                {loading ? 'Processing...' : 'Clock IN'}
                </button>
            )}
            
            {(lastRecord && lastRecord.type === 'IN') && (
                <button 
                disabled={loading} 
                onClick={() => handleCheckIn('OUT')}
                className="danger"
                style={{ flex: 1 }}
                >
                {loading ? 'Processing...' : 'Clock OUT'}
                </button>
            )}
            </div>
        )}

      {message && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          borderRadius: 'var(--radius)', 
          backgroundColor: message.includes('failed') ? '#fee2e2' : '#dcfce7',
          color: message.includes('failed') ? 'var(--danger)' : '#166534',
          fontWeight: 500
        }}>
          {message}
        </div>
      )}
    </div>
  );
};