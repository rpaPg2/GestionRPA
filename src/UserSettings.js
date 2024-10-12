import React, { useEffect, useState } from 'react';
import './UserSettings.css';

const UserSettings = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-info?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Error fetching user info:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const isPasswordValid = (password) => {
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasSpecialCharacter; // Validar longitud y carácter especial
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(newPassword)) {
      setMessage('La contraseña debe tener al menos 8 caracteres y un carácter especial.'); // Mensaje de error
      setMessageType('error');
      return;
    }

    setIsButtonDisabled(true); // Desactivar el botón mientras se procesa la solicitud

    try {
      const response = await fetch(`http://localhost:5000/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      if (response.ok) {
        setMessage('Contraseña cambiada exitosamente.'); // Mensaje de éxito
        setMessageType('success'); // Tipo de mensaje
        setIsEditingPassword(false);
        setNewPassword('');
        setShowPassword(false);

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage('Error al cambiar la contraseña: ' + errorData.error); // Mensaje de error
        setMessageType('error'); // Tipo de mensaje

        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al comunicarse con el servidor.'); // Mensaje de error en la comunicación
      setMessageType('error'); // Tipo de mensaje

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } finally {
      setIsButtonDisabled(false); // Volver a habilitar el botón después del procesamiento
    }
  };

  const handleCancel = () => {
    setIsEditingPassword(false);
    setNewPassword('');
    setShowPassword(false);
  };

  if (!userInfo) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="user-settings-container">
      <h1>Datos de usuario</h1>

      {/* Mostrar mensaje de alerta */}
      {message && (
        <div className={`alert ${messageType}`}>
          {message}
        </div>
      )}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Usuario</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Código de Empleado</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Posición</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Contraseña</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{userInfo.Usuario}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{userInfo.CodigoEmpleado}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{userInfo.Nombre}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{userInfo.Posicion}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={isEditingPassword ? newPassword : userInfo.Contraseña}
                onChange={(e) => isEditingPassword ? setNewPassword(e.target.value) : null}
                readOnly={!isEditingPassword}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', marginTop: '-40px', fontSize: '0.6em' }}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  style={{ marginRight: '0px' }} // Espacio entre el checkbox y el texto
                />
                Ver Contraseña
              </label>
            </td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              {isEditingPassword ? (
                <>
                  <button className="btn" onClick={handleChangePassword} disabled={isButtonDisabled}>Guardar</button>
                  <button className="btn" onClick={handleCancel}>Cancelar</button>
                </>
              ) : (
                <button className="btn" onClick={() => setIsEditingPassword(true)}>Cambiar Contraseña</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserSettings;
