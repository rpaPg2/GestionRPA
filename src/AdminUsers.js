import React from 'react';
import './AdminUsers.css';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="user-settings-container">
      <h1 className="menu-titleAdmon">Administración de usuarios</h1>

      <div className="menu-options">
        <div className="menu-option" onClick={() => navigate('/create-user')}>
          Crear y Editar Usuarios
        </div>
        <div className="menu-option" onClick={() => navigate('/list-bots')}>
          Bots Disponibles
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
