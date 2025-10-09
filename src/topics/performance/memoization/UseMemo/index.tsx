import React, { useState } from 'react';
import WithoutMemo from './WithoutMemo';
import WithMemo from './WithMemo';

export default function UseMemo() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);

  return (
    <div>
      <h1>useMemo Demonstration</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Click the number buttons to see how useMemo prevents expensive calculations from running on every render.
        The non-memoized component recalculates on every render, while the memoized component only recalculates when the number actually changes.
      </p>
      
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              setSelectedNumber(1);
              setClickCount(prev => prev + 1);
            }}
            style={{ 
              padding: "12px 20px", 
              borderRadius: "8px", 
              border: selectedNumber === 1 ? "2px solid #3b82f6" : "2px solid #e5e7eb",
              backgroundColor: selectedNumber === 1 ? "#dbeafe" : "white",
              color: selectedNumber === 1 ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Number 1
          </button>
          
          <button
            onClick={() => {
              setSelectedNumber(2);
              setClickCount(prev => prev + 1);
            }}
            style={{ 
              padding: "12px 20px", 
              borderRadius: "8px", 
              border: selectedNumber === 2 ? "2px solid #3b82f6" : "2px solid #e5e7eb",
              backgroundColor: selectedNumber === 2 ? "#dbeafe" : "white",
              color: selectedNumber === 2 ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Number 2
          </button>
          
          <button
            onClick={() => {
              setSelectedNumber(3);
              setClickCount(prev => prev + 1);
            }}
            style={{ 
              padding: "12px 20px", 
              borderRadius: "8px", 
              border: selectedNumber === 3 ? "2px solid #3b82f6" : "2px solid #e5e7eb",
              backgroundColor: selectedNumber === 3 ? "#dbeafe" : "white",
              color: selectedNumber === 3 ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Number 3
          </button>
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gap: "20px", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
        <WithoutMemo number={selectedNumber} clickCount={clickCount} />
        <WithMemo number={selectedNumber} clickCount={clickCount} />
      </div>
      
      <div className='tips'>
        <h3>💡 How to test:</h3>
        <ol>
          <li>Click "Number 1" multiple times - watch the calculation counts!</li>
          <li>Click "Number 2" - both components should recalculate</li>
          <li>Click "Number 1" again - only non-memoized component recalculates</li>
        </ol>
      </div>
    </div>
  );
}
