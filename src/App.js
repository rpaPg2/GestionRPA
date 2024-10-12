import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Historicos from './Historicos';
import Bots from './Bots';
import Estatus from './Estatus';
import UserSettings from './UserSettings';
import AdminUsers from './AdminUsers';
import Login from './Login';
import Bienvenida from './Bienvenida';
import CreateUser from './CreateUser'; // Asegúrate de tener este componente
import EditUser from './EditUser'; // Asegúrate de tener este componente
import ListBots from './ListBots'; // Asegúrate de tener este componente
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user'); // Eliminar datos del usuario
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  const isAuthenticated = !!localStorage.getItem('user');

  return (
    <div className="App">
      <Routes>
        {/* Ruta para el formulario de inicio de sesión */}
        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/Bienvenida" />} />

        {/* Rutas autenticadas */}
        {isAuthenticated && (
          <>
            {/* Aquí, Sidebar se muestra en todas las rutas protegidas */}
            <Route
              path="/Bienvenida"
              element={
                <>
                  <Sidebar />
                  <Bienvenida />
                </>
              }
            />
            
            <Route
              path="/reports/dashboard"
              element={
                <>
                  <Sidebar />
                  <Dashboard />
                </>
              }
            />
            
            <Route
              path="/reports/historicos"
              element={
                <>
                  <Sidebar />
                  <Historicos />
                </>
              }
            />
            
            <Route
              path="/automation/bots"
              element={
                <>
                  <Sidebar />
                  <Bots />
                </>
              }
            />
            
            <Route
              path="/automation/estatus"
              element={
                <>
                  <Sidebar />
                  <Estatus />
                </>
              }
            />
            
            <Route
              path="/settings/usuario"
              element={
                <>
                  <Sidebar />
                  <UserSettings />
                </>
              }
            />
            
            <Route
              path="/admin/usuarios"
              element={
                <>
                  <Sidebar />
                  <AdminUsers />
                </>
              }
            />
            {/* Rutas adicionales para manejar la creación, edición y listado de bots */}
            <Route
              path="/create-user"
              element={
                <>
                  <Sidebar />
                  <CreateUser />
                </>
              }
            />
            <Route
              path="/edit-user"
              element={
                <>
                  <Sidebar />
                  <EditUser />
                </>
              }
            />
            <Route
              path="/list-bots"
              element={
                <>
                  <Sidebar />
                  <ListBots />
                </>
              }
            />
          </>
        )}

        {/* Redirige cualquier ruta no válida a la página de inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
