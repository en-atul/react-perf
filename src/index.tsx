import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Optional: if you're using global styles
import './styles/global.scss';

// Mounting React app using React 18+
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found. Make sure there is a div with id="root" in your index.html');
}

const root = createRoot(container);
root.render(<App />);
