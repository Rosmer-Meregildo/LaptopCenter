import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reparaciones from './pages/Reparaciones';
import NuevaOrden from './pages/NuevaOrden';
import Inventario from './pages/Inventario';


function App() {
  return (
    // Cambiado de BrowserRouter a HashRouter
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reparaciones" element={<Reparaciones />} />
        <Route path="/nueva-orden" element={<NuevaOrden />} />
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </HashRouter>
    
  )
}

export default App
