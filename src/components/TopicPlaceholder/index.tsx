import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopicPlaceholder.scss';

interface TopicPlaceholderProps {
  topicId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export function TopicPlaceholder({ topicId, title, description, icon, color }: TopicPlaceholderProps) {
  const navigate = useNavigate();

  return (
    <div className="topic-placeholder">
      <div className="placeholder-header">
        <div className="topic-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="topic-info">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="placeholder-content">
        <div className="coming-soon">
          <h2>🚧 Coming Soon</h2>
          <p>This performance topic is planned for implementation.</p>
          <p>Check back later for a comprehensive demo and examples!</p>
        </div>

        <div className="placeholder-features">
          <h3>What you'll find here:</h3>
          <ul>
            <li>📚 Detailed explanations and best practices</li>
            <li>🎯 Interactive examples and demos</li>
            <li>⚡ Performance benchmarks and comparisons</li>
            <li>🛠️ Implementation guides and code samples</li>
            <li>📊 Real-world use cases and scenarios</li>
          </ul>
        </div>

        <div className="placeholder-actions">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Topics
          </button>
          
          <button 
            className="github-btn"
            onClick={() => {
              window.open('https://github.com/en-atul/react-perf', '_blank');
            }}
          >
            💡 Request Implementation
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopicPlaceholder;
