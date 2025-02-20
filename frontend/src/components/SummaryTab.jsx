
import React from "react";

export default function SummaryTab({ processData }) {
  return (
    <div>
      <h2>Process Summary</h2>
      <p>Total Time: {processData.totalTime} sec</p>
      <p>Oil Phase: {processData.oilPhase.length} ingredients</p>
      <p>Water Phase: {processData.waterPhase.length} ingredients</p>
      <button onClick={() => alert("Downloading CSV...")}>Download CSV</button>
    </div>
  );
}
