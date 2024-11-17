import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TestProvider } from './context/TestContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestProvider>
      <App />
    </TestProvider>
  </React.StrictMode>,
)
