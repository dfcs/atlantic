
import React, { useState } from "react";
import IngredientsTab from "./IngredientsTab";
import SensorSettingsTab from "./SensorSettingsTab";
import SummaryTab from "./SummaryTab";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function LuxDashboard() {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [processData, setProcessData] = useState({
    oilPhase: [],
    waterPhase: [],
    processingModule: "",
    postProcessingModule: "",
    processId: Date.now(),
    sensorData: [],
    totalTime: 0,
  });

  return (
    <div className="p-4">
      <div className="flex space-x-4">
        <button onClick={() => setActiveTab("ingredients")}>Ingredients</button>
        <button onClick={() => setActiveTab("sensors")}>Sensors</button>
        <button onClick={() => setActiveTab("summary")}>Summary</button>
      </div>

      <div className="mt-4">
        {activeTab === "ingredients" && <IngredientsTab setProcessData={setProcessData} processData={processData} />}
        {activeTab === "sensors" && <SensorSettingsTab setProcessData={setProcessData} processData={processData} />}
        {activeTab === "summary" && <SummaryTab processData={processData} />}
      </div>
    </div>
  );
}
