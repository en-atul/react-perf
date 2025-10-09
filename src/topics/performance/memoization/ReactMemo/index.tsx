import React, { useState } from "react";
import WithMemo from "./WithMemo";
import WithoutMemo from "./WithoutMemo";

enum Languages {
  JAVA = "java",
  PYTHON = "python",
  GO = "go",
}

export default function ReactMemo() {
  const [value, setValue] = useState<Languages>(Languages.JAVA);
  const [clickCount, setClickCount] = useState(0);
  
  return (
    <div>
      <h1>React.memo Demonstration</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Click any button multiple times to see the difference! 
        The non-memoized component re-renders on every click, while the memoized component only re-renders when the language prop actually changes.
        <br />
        <strong>Click count: {clickCount}</strong>
      </p>
      
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "12px", fontWeight: "bold" }}>
          Select Language:
        </label>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
                setValue(Languages.JAVA);
                setClickCount(prev => prev + 1);
            }}
            style={{ 
              padding: "12px 20px", 
              borderRadius: "8px", 
              border: value === Languages.JAVA ? "2px solid #3b82f6" : "2px solid #e5e7eb",
              backgroundColor: value === Languages.JAVA ? "#dbeafe" : "white",
              color: value === Languages.JAVA ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            ☕ Java
          </button>
          <button
            onClick={() => {
              setValue(Languages.PYTHON);
              setClickCount(prev => prev + 1);
            }}
            style={{ 
              padding: "12px 20px", 
              borderRadius: "8px", 
              border: value === Languages.PYTHON ? "2px solid #3b82f6" : "2px solid #e5e7eb",
              backgroundColor: value === Languages.PYTHON ? "#dbeafe" : "white",
              color: value === Languages.PYTHON ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            🐍 Python
          </button>
          <button
            onClick={() => {
              setValue(Languages.GO);
              setClickCount(prev => prev + 1);
            }}
            style={{ 
              padding: "12px 20px", 
              borderRadius: "8px", 
              border: value === Languages.GO ? "2px solid #3b82f6" : "2px solid #e5e7eb",
              backgroundColor: value === Languages.GO ? "#dbeafe" : "white",
              color: value === Languages.GO ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            🚀 Go
          </button>
        </div>
      </div>
   
      <div style={{ 
        display: "grid", 
        gap: "20px", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
        <WithoutMemo language={value} 
        // clickCount={clickCount} 
        />
        <WithMemo language={value} 
        // clickCount={clickCount} 
        />
      </div>
      
      <div className="tips">
        <h3>💡 Try this:</h3>
        <ol>
          <li>Click the same language button multiple times - watch the render counts!</li>
          <li>Switch to a different language - both components should re-render</li>
          <li>Click the same button again - only the non-memoized component re-renders</li>
        </ol>
      </div>
    </div>
  );
}
