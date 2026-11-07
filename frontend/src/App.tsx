// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ApiResponse {
  message: string;
}

function App() {
  const [data, setData] = useState<string>('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:3000/api/hello');
        setData(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData('Failed to load data from backend.');
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>React + NestJS Template</h1>
      <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Backend Status:</h2>
        <p>{data}</p>
      </div>
    </div>
  );
}

export default App;