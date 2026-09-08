import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import LaundryPage from './pages/LaundryPage'
import MenuPage from './pages/MenuPage'
import BookingsPage from './pages/BookingsPage'
import SettingsPage from './pages/SettingsPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="lavanderia" element={<LaundryPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="reservas" element={<BookingsPage />} />
          <Route path="ajustes" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
