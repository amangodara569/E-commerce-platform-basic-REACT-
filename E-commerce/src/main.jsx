import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; //for routes
import './index.css'
import App from './App.jsx'
import Apps from './Apps.jsx'; //for routes
import Ludo from '../../cards/src/Ludo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />


    {/* for routes */}
    <BrowserRouter>
      <Apps/>
    </BrowserRouter>

    <Ludo/>

    
  </StrictMode>,
)
