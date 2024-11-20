// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Main script executing'); // Debug log

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found'); // Debug log
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('App mounted'); // Debug log
}