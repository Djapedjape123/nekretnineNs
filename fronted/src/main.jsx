import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ProdajaPage from './pages/ProdajaPage.jsx'
import IzdavanjePage from './pages/IzdavanjePage.jsx'
import FavoritePage from './pages/FavoritePage.jsx'
import SinglePege from './pages/SinglePege.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/kontakt',
        element: <ContactPage />
      },
      {
        path: '/prodaja',
        element: <ProdajaPage />
      },
       {
        path: '/izdavanje',
        element: <IzdavanjePage />
      },
       {
        path: '/favorite',
        element: <FavoritePage />
      },
      {
        path: '/single/:id',
        element: <SinglePege />
      },

      
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
   
      <RouterProvider router={router} />
   
  </StrictMode>,
)
