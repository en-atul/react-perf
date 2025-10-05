import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationHeader.scss';

export function NavigationHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/topics';

  return (
    <header className="navigation-header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🚀</span>
          <span className="logo-text">React Performance</span>
        </div>

    

        <div className="header-actions">
          <button 
            className="back-btn"
            onClick={() => navigate(-1)}
            disabled={!window.history.length}
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavigationHeader;
