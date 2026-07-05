import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        // Check for updates every 30 seconds
        setInterval(() => reg.update(), 30000);
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          newSW?.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              newSW.postMessage('SKIP_WAITING');
              window.location.reload();
            }
          });
        });
      })
      .catch(err => console.log('SW registration failed:', err));
  });
}
