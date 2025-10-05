import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export function RouterDebug() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '1rem', 
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#4CAF50' }}>🔍 Router Debug</h4>
      <div><strong>Pathname:</strong> {location.pathname}</div>
      <div><strong>Search:</strong> {location.search || 'none'}</div>
      <div><strong>Hash:</strong> {location.hash || 'none'}</div>
      <div><strong>Params:</strong> {JSON.stringify(params) || 'none'}</div>
      <div><strong>State:</strong> {location.state ? JSON.stringify(location.state) : 'none'}</div>
      
      <div style={{ marginTop: '0.5rem' }}>
        <button 
          onClick={() => navigate('/test')}
          style={{ 
            padding: '0.25rem 0.5rem', 
            background: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '10px',
            marginRight: '0.25rem'
          }}
        >
          Test Route
        </button>
        <button 
          onClick={() => navigate('/topics/prefetch/on-demand')}
          style={{ 
            padding: '0.25rem 0.5rem', 
            background: '#FF9800', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '10px'
          }}
        >
          Prefetch Route
        </button>
      </div>
    </div>
  );
}

export default RouterDebug;
