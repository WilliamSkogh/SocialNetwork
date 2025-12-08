import ReactDom from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme.css'
import App from './App.tsx'
import { ThemeProvider } from './ThemeContext.tsx'
import React from 'react'

ReactDom.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
