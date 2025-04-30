import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const basename = import.meta.env.PROD ? '/friendship-bracelet-generator' : '/';
console.log('Running in:', import.meta.env.PROD ? 'production' : 'development');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
