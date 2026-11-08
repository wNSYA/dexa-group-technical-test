// frontend/src/Attendance.tsx
import React, { useEffect, useRef, useState } from 'react';
import api from './api';

export const Attendance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

    // 1. Draw the current video frame onto the hidden canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. Convert the canvas image into a binary Blob (a File)
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setMessage('Failed to capture image.');
        setLoading(false);
        return;
      }

      // 3. Build the multipart/form-data payload
      const formData = new FormData();
      formData.append('type', type);
      formData.append('photo', blob, `checkin-${Date.now()}.jpg`); // Attach the file

      try {
        // 4. Send the request
        // Our api.ts interceptor automatically attaches the JWT token!
        await api.post('/attendance/check-in', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(`Successfully clocked ${type} !`);
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

      {isCameraOn && (
        <div className="flex-gap" style={{ justifyContent: 'center' }}>
          <button 
            disabled={loading} 
            onClick={() => handleCheckIn('IN')}
            style={{ flex: 1, backgroundColor: 'var(--primary)' }}
          >
            {loading ? 'Processing...' : 'Clock IN'}
          </button>
          
          <button 
            disabled={loading} 
            onClick={() => handleCheckIn('OUT')}
            className="danger"
            style={{ flex: 1 }}
          >
            {loading ? 'Processing...' : 'Clock OUT'}
          </button>
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