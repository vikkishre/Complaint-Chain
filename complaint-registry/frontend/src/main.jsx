import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../src/Context/index.jsx'; // Import UserProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>  {/* Wrap the App component with UserProvider */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
