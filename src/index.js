import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Fix for mobile viewport height issues
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initially and add event listener for orientation changes
setViewportHeight();
window.addEventListener('resize', setViewportHeight);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
