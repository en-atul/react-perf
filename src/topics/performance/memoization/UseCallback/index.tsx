import React, { useState, useCallback } from 'react';
import WithoutCallback from './WithoutCallback';
import WithCallback from './WithCallback';

export default function UseCallback() {
  const [count, setCount] = useState(0);

  // Function without useCallback - creates new function on every render
  const handleClickWithoutCallback = () => {
    console.log('Button clicked without callback');
  };

  // Function with useCallback - only creates new function when dependencies change
  const handleClickWithCallback = useCallback(() => {
    console.log('Button clicked with callback');
  }, []);

  return (
    <div >
      <h1>useCallback Demonstration</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Click the counter button to see how useCallback prevents unnecessary re-renders of child components.
        The non-callback component re-renders on every parent update, while the callback component only re-renders when its props actually change.
      </p>
      
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => setCount(prev => prev + 1)}
            className='increment__counter'
          >
            Increment Counter: {count}
          </button>
        
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gap: "20px", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
        <WithoutCallback 
          onClick={handleClickWithoutCallback}
        />
        <WithCallback 
          onClick={handleClickWithCallback}
        />
      </div>
      
      <div className='tips'>
        <h3>💡 How to test:</h3>
        <ol>
          <li>Click "Increment Counter" multiple times - watch the render counts!</li>
          <li>Type in the input field - both components should re-render</li>
          <li>Click counter again - only the non-callback component re-renders</li>
        </ol>
      </div>
    </div>
  );
}
