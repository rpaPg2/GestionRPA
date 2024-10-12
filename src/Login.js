import React, { useState } from 'react'; 
import axios from 'axios';
import './Login.css'; // Asegúrate de que la ruta sea correcta


const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      // Enviar una solicitud al backend para validar las credenciales
      const response = await axios.get(`http://localhost:5000/login`, {
        params: { usuario, password },
      });

      if (response.data.message === 'Inicio de sesión exitoso') {
        sessionStorage.setItem('userId', response.data.userId); // Guardar el ID del usuario en sessionStorage
        localStorage.setItem('user', usuario); // Guardar el usuario en localStorage
        localStorage.setItem('role', response.data.role); // Guardar el rol en localStorage

        // Redirigir a la página adecuada según el rol
        if (response.data.role === 'admin') {
          window.location.href = '/Admin'; // Redirigir a la página de administración
        } else {
          window.location.href = '/Bienvenida'; // Redirigir a la página de bienvenida
        }
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error en la conexión al servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>RPA</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
