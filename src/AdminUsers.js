import React, { useEffect } from 'react';
import './AdminUsers.css';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();

  // useEffect para añadir la clase "show" cuando el componente se monta
  useEffect(() => {
    const container = document.querySelector('.user-settings-container');
    if (container) {
      container.classList.add('show');
    }
  }, []); // El array vacío asegura que esto se ejecute solo al montar el componente

  return (
    <div className="admin-user-container">
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
