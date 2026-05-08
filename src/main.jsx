import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'
import { Toaster } from 'react-hot-toast'

// StrictMode removed to prevent duplicate polling/mounting in development
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <DashboardProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </DashboardProvider>
  </ThemeProvider>
)
