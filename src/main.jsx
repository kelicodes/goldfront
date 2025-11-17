import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ShopContextProvider } from './Context/ShopContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/Authcontext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<AuthProvider>
  <BrowserRouter>
  <ShopContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </ShopContextProvider>
  </BrowserRouter>
  </AuthProvider>
)
