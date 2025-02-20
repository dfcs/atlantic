import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function LuxDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL); // Environment variable from Render
    socket.on('luxData', (luxMessage) => {
      setData((prevData) => [
        ...prevData.slice(-20), // Keep the last 20 readings
        { time: new Date(luxMessage.timestamp).toLocaleTimeString(), lux: luxMessage.lux },
      ]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Lux Sensor Dashboard</h1>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="lux" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default LuxDashboard;