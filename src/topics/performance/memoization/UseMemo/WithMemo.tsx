import React, { useMemo, useRef } from 'react';

interface WithMemoProps {
  number: number | null;
  clickCount: number;
}

export default function WithMemo(props: WithMemoProps) {
  const calculationCountRef = useRef(0);
  const lastCalculationTimeRef = useRef(Date.now());
  
  // Expensive calculation that only runs when number changes
  const expensiveValue = useMemo(() => {
    calculationCountRef.current += 1;
    lastCalculationTimeRef.current = Date.now();
    
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(Math.random() * 1000);
    }
    return result;
  }, [props.number]);

  return (
    <div className='correct__usage'>
      <h3>✅ With useMemo</h3>
      <p><strong>Selected Number:</strong> {props.number || 'None'}</p>
      <p><strong>Click Count:</strong> {props.clickCount}</p>
      <p><strong>Calculation Count:</strong> {calculationCountRef.current}</p>
      <p><strong>Last Calculation:</strong> {new Date(lastCalculationTimeRef.current).toLocaleTimeString()}</p>
      <p><strong>Expensive Value:</strong> {expensiveValue.toFixed(2)}</p>
      
      <div className="info">
        ✨ Only recalculates when number changes
      </div>
    </div>
  );
}
