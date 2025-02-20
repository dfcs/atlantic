
import React, { useState, useEffect } from "react";

const SENSORS = ["TempC", "REF Sensor", "10T Sensor", "45F Sensor", "90N Sensor", "135B Sensor"];
const GAINS = [1, 25, 428, 9876];
const TIMINGS = [200, 300, 400, 500, 600];

export default function SensorSettingsTab({ setProcessData, processData }) {
  const [sensorSettings, setSensorSettings] = useState(SENSORS.map((name) => ({ name, gain: 1, timing: 200, enabled: true })));

  useEffect(() => {
    const interval = setInterval(() => {
      const newSensorData = sensorSettings.map((sensor) => ({
        name: sensor.name,
        value: Math.random() * 100,
      }));
      setProcessData((prev) => ({ ...prev, sensorData: newSensorData }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sensorSettings]);

  return (
    <div>
      <h2>Sensor Settings</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Sensor</th>
            <th>Gain</th>
            <th>Timing</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {sensorSettings.map((sensor, index) => (
            <tr key={sensor.name}>
              <td>{sensor.name}</td>
              <td>
                <select onChange={(e) => {
                  const copy = [...sensorSettings];
                  copy[index].gain = parseInt(e.target.value);
                  setSensorSettings(copy);
                }}>
                  {GAINS.map((gain) => <option key={gain} value={gain}>{gain}X</option>)}
                </select>
              </td>
              <td>
                <select onChange={(e) => {
                  const copy = [...sensorSettings];
                  copy[index].timing = parseInt(e.target.value);
                  setSensorSettings(copy);
                }}>
                  {TIMINGS.map((time) => <option key={time} value={time}>{time}ms</option>)}
                </select>
              </td>
              <td>
                <input type="checkbox" checked={sensor.enabled} onChange={() => {
                  const copy = [...sensorSettings];
                  copy[index].enabled = !copy[index].enabled;
                  setSensorSettings(copy);
                }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
