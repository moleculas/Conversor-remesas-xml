import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RemesaProvider } from './context/RemesaContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RemesaProvider>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </RemesaProvider>
  </React.StrictMode>
);