import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    setLoading(true); // Activa el estado de carga
    try {
      const response = await axios.get(`https://fronted-gestion-rpa.vercel.app/login`, {
        params: { usuario, password },
      });
  
      if (response.data.message === 'Inicio de sesión exitoso') {
        sessionStorage.setItem('userId', response.data.userId);
        localStorage.setItem('user', usuario);
        localStorage.setItem('role', response.data.role);
  
        if (response.data.role === 'admin') {
          window.location.href = '/Admin';
        } else {
          window.location.href = '/Bienvenida';
        }
      } else {
        // Esto probablemente no se ejecutará porque el error debería ir al catch
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        // Si el servidor respondió con un código de estado fuera del rango 2xx
        setError(error.response.data.message || 'Error en la conexión al servidor');
      } else if (error.request) {
        // Si la solicitud fue hecha, pero no se recibió respuesta
        setError('No se recibió respuesta del servidor');
      }else {
        // Si ocurrió un error al configurar la solicitud
        setError('Error en la conexión al servidor');
      }
    } finally {
      setLoading(false); // Desactiva el estado de carga al final
    }
  };
  

  return (
    <div className="login-page">
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
          <button type="submit" disabled={loading}>Iniciar sesión</button>
        </form>
        {loading && <p>Cargando...</p>} {/* Mensaje de carga */}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
