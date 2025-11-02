import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Export App component for Angular to use
export { App };

// Function to mount the React app with provided React/ReactDOM instances
export const mount = (containerId, reactInstance, reactDOMInstance) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  // Use provided React instances or fall back to bundled ones
  const ReactToUse = reactInstance || React;
  const ReactDOMToUse = reactDOMInstance || ReactDOM;
  
  const root = ReactDOMToUse.createRoot(container);
  root.render(ReactToUse.createElement(App));
  return root;
};

// Function to unmount the React app
export const unmount = (root) => {
  if (root) {
    root.unmount();
  }
};

// If running standalone, mount to root
if (document.getElementById('root')) {
  mount('root');
}

