const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mqtt = require('mqtt');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'https://atlantic-1-uvdb.onrender.com', // Frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const io = new Server(server, {
  cors: {
    origin: 'https://atlantic-1-uvdb.onrender.com',
    methods: ['GET', 'POST'],
  }
});

const mqttOptions = {
  host: '1f3cf1744c084b4bbc9522c7dcd061e3.s1.eu.hivemq.cloud',
  port: 8883,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: 'mqtts',
};

const mqttClient = mqtt.connect(mqttOptions);

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  mqttClient.subscribe('devices/sensors/lux', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  const luxValue = message.toString();
  console.log(`Received Lux: ${luxValue}`);
  io.emit('luxData', { lux: parseFloat(luxValue), timestamp: new Date() });
});

io.on('connection', (socket) => {
  console.log('Frontend connected');
  socket.on('disconnect', () => console.log('Frontend disconnected'));
});

app.get('/', (req, res) => {
  res.send('MQTT Backend is Running!');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// React Frontend Component
const React = require('react');
const { useEffect, useState } = require('react');
const ioClient = require('socket.io-client');
const { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } = require('recharts');

function LuxDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = ioClient('http://localhost:4000');
    socket.on('luxData', (luxMessage) => {
      setData((prevData) => [
        ...prevData.slice(-20), // Keep the last 20 readings
        {
          time: new Date(luxMessage.timestamp).toLocaleTimeString(),
          lux: luxMessage.lux
        }
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

module.exports = LuxDashboard;
