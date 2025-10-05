import { useState, useEffect } from 'react';

export default function HeavyComponent() {
  const [data, setData] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setIsCalculating(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => Math.random() * 1000);
      setData(largeDataset);
      
      // Simulate heavy computation
      const startTime = performance.now();
      const sum = largeDataset.reduce((acc, num) => acc + num, 0);
      const endTime = performance.now();
      
      setResult(sum);
      setIsCalculating(false);
      
      console.log(`Heavy computation took ${endTime - startTime} milliseconds`);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate rendering large list
  const renderData = data.slice(0, 100); 

  return (
    <div className="heavy-component">
      <h3>Heavy Component Loaded!</h3>
      <p>This component simulates heavy computation and large data processing.</p>
      
      {isCalculating ? (
        <div className="calculating">
          <div className="spinner">⏳</div>
          <p>Performing heavy calculations...</p>
        </div>
      ) : (
        <div className="results">
          <h4>Computation Results:</h4>
          <p><strong>Total Sum:</strong> {result.toLocaleString()}</p>
          <p><strong>Data Points:</strong> {data.length.toLocaleString()}</p>
          <p><strong>Average:</strong> {(result / data.length).toFixed(2)}</p>
          
          <div className="data-preview">
            <h5>Sample Data (first 100 items):</h5>
            <div className="data-grid">
              {renderData.map((item, index) => (
                <span key={index} className="data-item">
                  {item.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="component-info">
        <h4>Component Information:</h4>
        <ul>
          <li>✅ Lazy loaded with React.lazy</li>
          <li>✅ Prefetched on hover</li>
          <li>✅ Webpack chunk: "heavy-component"</li>
          <li>✅ Suspense boundary for loading state</li>
        </ul>
      </div>
    </div>
  );
}
