
import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const INGREDIENTS = ["Olive Oil", "Canola Oil", "Lemon Juice", "Vinegar", "Garlic", "Salt", "Pepper", "Honey", "Mustard", "Soy Sauce"];

export default function IngredientsTab({ setProcessData, processData }) {
  const [oilPhase, setOilPhase] = useState([]);
  const [waterPhase, setWaterPhase] = useState([]);

  const handleDrop = (ingredient, target) => {
    const amount = prompt(`Enter amount of ${ingredient} (ml)`);
    if (!amount) return;

    const newIngredient = { name: ingredient, amount: parseFloat(amount) };
    
    if (target === "oil") {
      setOilPhase([...oilPhase, newIngredient]);
    } else {
      setWaterPhase([...waterPhase, newIngredient]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4">
        <div className="w-1/3 border p-4">
          <h2>Ingredients</h2>
          {INGREDIENTS.map((item) => (
            <DraggableIngredient key={item} name={item} />
          ))}
        </div>

        <DropZone title="Oil Phase" onDrop={(item) => handleDrop(item, "oil")} ingredients={oilPhase} />
        <DropZone title="Water Phase" onDrop={(item) => handleDrop(item, "water")} ingredients={waterPhase} />
      </div>
    </DndProvider>
  );
}

function DraggableIngredient({ name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "INGREDIENT",
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`p-2 border my-1 ${isDragging ? "opacity-50" : ""}`}>
      {name}
    </div>
  );
}

function DropZone({ title, onDrop, ingredients }) {
  const [, drop] = useDrop(() => ({
    accept: "INGREDIENT",
    drop: (item) => onDrop(item.name),
  }));

  return (
    <div ref={drop} className="w-1/3 border p-4">
      <h2>{title}</h2>
      {ingredients.map((ing, index) => (
        <p key={index}>{ing.name} - {ing.amount}ml</p>
      ))}
    </div>
  );
}
