// frontend/src/SecureImage.tsx
import React, { useEffect, useState } from 'react';
import api from './api';

interface SecureImageProps {
  url: string;
  alt: string;
  style?: React.CSSProperties;
}

export const SecureImage: React.FC<SecureImageProps> = ({ url, alt, style }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string = '';
    
    // Extract just the path ("/uploads/filename.jpg") from the full saved URL
    const path = new URL(url).pathname; 

    api.get(path, { responseType: 'blob' })
      .then((response) => {
        // Convert the binary blob into a local URL the browser can display
        objectUrl = URL.createObjectURL(response.data);
        setImgSrc(objectUrl);
      })
      .catch(() => setError(true));

    return () => {
      // Cleanup memory when the component unmounts
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    }, [url]);

    if (error) return (
        <div style={{ 
        ...style, 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '11px', 
        color: 'var(--text-muted)' 
        }}>
        No Image
        </div>
    );
  
  if (!imgSrc) return <div style={{ ...style, backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>Loading...</div>;

  return <img src={imgSrc} alt={alt} style={style} />;
};