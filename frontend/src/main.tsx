import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';

import { StatusProvider } from './context/StatusProvider.tsx';
import ThemeProvider from './context/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StatusProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StatusProvider>
    </BrowserRouter>
  </StrictMode>
);
