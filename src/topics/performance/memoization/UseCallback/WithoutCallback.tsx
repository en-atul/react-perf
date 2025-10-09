import React, { useState, useEffect, useRef } from 'react';

interface WithoutCallbackProps {
  onClick: () => void;
}

function WithoutCallback(props: WithoutCallbackProps) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());
  const prevFunctionRef = useRef(props.onClick);
  
  // Increment render count on every render
  renderCountRef.current += 1;
  lastRenderTimeRef.current = Date.now();
  
  // Check if function reference changed
  const functionChanged = props.onClick !== prevFunctionRef.current;
  if (functionChanged) {
    prevFunctionRef.current = props.onClick;
  }

  return (
    <div className='wrong__usage'>
      <h3>❌ Without useCallback</h3>
      <p><strong>Render Count:</strong> {renderCountRef.current}</p>
      <p><strong>Last Render:</strong> {new Date(lastRenderTimeRef.current).toLocaleTimeString()}</p>
      <p><strong>Function Reference:</strong> {functionChanged ? 'Changed!' : 'Same'}</p>
      
      <div className="info">
        ⚠️ Function recreated on every parent render
      </div>
    </div>
  );
}

export default React.memo(WithoutCallback);
