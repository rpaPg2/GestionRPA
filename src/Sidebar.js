import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate para redireccionar
import './App.css'; // Asegúrate de importar el archivo CSS
import { FaBars } from 'react-icons/fa'; // Importa un icono de react-icons

function Sidebar() {
  const [isReportsOpen, setReportsOpen] = useState(false);
  const [isAutomationOpen, setAutomationOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isAdminOpen, setAdminOpen] = useState(false);
  const navigate = useNavigate(); // Usa useNavigate para redireccionar

  const handleMenuClick = () => {
    navigate('/'); // Redirige a la ruta principal
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Eliminar el usuario de localStorage
    localStorage.removeItem('role'); // También eliminar el rol del usuario
    sessionStorage.removeItem('userId');//Tambien elimina el id
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  // Verifica si hay un usuario almacenado en localStorage
  const isAuthenticated = localStorage.getItem('user') !== null;
  const userRole = localStorage.getItem('role'); // Obtén el rol del usuario

  if (!isAuthenticated) {
    return null; // No renderiza el Sidebar si no hay usuario autenticado
  }

  return (
    <div className="sidebar">
      <h2
        onClick={handleMenuClick}
        style={{
          cursor: 'pointer',
          padding: '20px 25px', // Ajustar el relleno para que sea más amplio
          backgroundColor: '#5b337b',
          borderRadius: '10px', // Bordes más redondeados para dar efecto de botón
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Centrar el texto y el ícono
          color: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.8)', // Agregar sombra para dar profundidad
          transition: 'background-color 0.3s ease, transform 0.2s ease', // Efecto suave al pasar el mouse
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#52327a'; // Cambia el color de fondo al pasar el mouse
          e.currentTarget.style.transform = 'scale(1.25)'; // Aumenta el tamaño al pasar el mouse
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#5c4080'; // Vuelve al color original
          e.currentTarget.style.transform = 'scale(1)'; // Restaura el tamaño original
        }}
      >
        <FaBars style={{ marginRight: '10px', fontSize: '1.5em' }} />
        <span style={{ color: '#93cc5c', fontSize: '2em', marginRight: '2px' }}>M</span>
        <span style={{ color: '#228bb6', fontSize: '2em', marginRight: '2px' }}>e</span>
        <span style={{ color: '#04ad6c', fontSize: '2em', marginRight: '2px' }}>n</span>
        <span style={{ color: '#6dd2b5', fontSize: '2em', marginRight: '2px' }}>ú</span>
      </h2>

      <ul>
        <li>
          <a onClick={() => setReportsOpen(!isReportsOpen)}>Reportes</a>
          {isReportsOpen && (
            <ul className="submenu">
              <li><Link to="/reports/dashboard">Dashboard</Link></li>
              <li><Link to="/reports/historicos">Históricos</Link></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => setAutomationOpen(!isAutomationOpen)}>RPA</a>
          {isAutomationOpen && (
            <ul className="submenu">
              <li><Link to="/automation/bots">Bots</Link></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => setSettingsOpen(!isSettingsOpen)}>Configuración</a>
          {isSettingsOpen && (
            <ul className="submenu">
              <li><Link to="/settings/usuario">Usuario</Link></li>
            </ul>
          )}
        </li>

        {/* Mostrar el apartado de Administración solo si el usuario es admin */}
        {userRole === 'admin' && (
          <li>
            <a onClick={() => setAdminOpen(!isAdminOpen)}>Administración</a>
            {isAdminOpen && (
              <ul className="submenu">
                <li><Link to="/admin/usuarios">Usuarios</Link></li>
              </ul>
            )}
          </li>
        )}
      </ul>

      {/* Botón de cerrar sesión */}
      <button 
        onClick={handleLogout} 
        style={{ 
          marginTop: 'auto', 
          padding: '10px', 
          backgroundColor: ' #527d94 ', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Sidebar;
