import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ludo from '../../cards/src/Ludo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Ludo />
  </StrictMode>,
)
