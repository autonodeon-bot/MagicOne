import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root not found');

console.log('Starting MagicOne app...');

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("Fatal render error:", e);
  rootElement.innerHTML = `<div style="color:red; padding:20px;"><h1>App Crash</h1><pre>${e}</pre></div>`;
}