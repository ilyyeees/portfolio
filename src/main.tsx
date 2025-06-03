import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Performance optimization: Ensure DOM is ready
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root with concurrent features enabled
const root = createRoot(rootElement);

// Render app with error boundary consideration
root.render(<App />);
