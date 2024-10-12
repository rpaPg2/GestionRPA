import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditUser.css';

const EditUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [codigoEmpleado, setCodigoEmpleado] = useState('');
    const [nombre, setNombre] = useState('');
    const [posicion, setPosicion] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bots, setBots] = useState([]); // Estado para los bots
    const [selectedBots, setSelectedBots] = useState([]); // Bots seleccionados para asignar/desasignar
    const navigate = useNavigate();
    
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user-form-back?id=${userId}`);
                const { user, config } = response.data;

                setUsername(user.username);
                setPassword(user.password);
                setRole(user.role);
                setCodigoEmpleado(config.codigo_empleado);
                setNombre(config.nombre);
                setPosicion(config.posicion);
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
                setError('Error al cargar los datos del usuario');
            }
        };

        const fetchBots = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user-bots-noy-asign?id=${userId}`); // Cambié aquí para que llame al endpoint correcto
                setBots(response.data.bots); // Asumiendo que el backend devuelve un objeto con una clave 'bots'
            } catch (error) {
                console.error('Error al obtener los bots:', error);
                setError('Error al cargar los bots');
            }
        };

        if (userId) {
            fetchUserData();
            fetchBots();
        } else {
            setError('ID de usuario no proporcionado');
        }
    }, [userId]);

    const handleCheckboxChange = (botId) => {
        setSelectedBots((prev) =>
            prev.includes(botId)
                ? prev.filter((id) => id !== botId)
                : [...prev, botId]
        );
    };

    const handleAssignBots = async () => {
        if (selectedBots.length === 0) return;
    
        const confirmAssign = window.confirm('¿Quieres asignar estos bots?');
        if (!confirmAssign) return;
    
        try {
            await axios.post('http://localhost:5000/api/assign-bots', {
                userId,
                botIds: selectedBots,
            });
            setSuccessMessage('Bots asignados correctamente.');
            setSelectedBots([]);
            
            // Recargar bots para actualizar el estado
            const response = await axios.get(`http://localhost:5000/api/user-bots-noy-asign?id=${userId}`);
            setBots(response.data.bots); // Cambié aquí para que acceda a 'bots'
        } catch (error) {
            console.error('Error al asignar bots:', error);
            setError('Error al asignar bots');
        }
    };
    
    const handleUnassignBots = async () => {
        if (selectedBots.length === 0) return;
    
        const confirmUnassign = window.confirm('¿Quieres desasignar estos bots?');
        if (!confirmUnassign) return;
    
        try {
            await axios.post('http://localhost:5000/api/unassign-bots', {
                userId,
                botIds: selectedBots,
            });
            setSuccessMessage('Bots desasignados correctamente.');
            setSelectedBots([]);
            
            // Recargar bots para actualizar el estado
            const response = await axios.get(`http://localhost:5000/api/user-bots-noy-asign?id=${userId}`);
            setBots(response.data.bots); // Cambié aquí para que acceda a 'bots'
        } catch (error) {
            console.error('Error al desasignar bots:', error);
            setError('Error al desasignar bots');
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/user-edit-update', {
                id: userId,
                username,
                password,
                role,
                codigoEmpleado,
                nombre,
                posicion,
            });
            setSuccessMessage('Usuario actualizado exitosamente.');
            setError('');
            // Limpiar el formulario después de la actualización
            setUsername('');
            setPassword('');
            setRole('user');
            setCodigoEmpleado('');
            setNombre('');
            setPosicion('');
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            setError('Error al actualizar el usuario');
            setSuccessMessage('');
        }
    };

    return (
        <div className="edit-user-container">
            <button onClick={() => navigate('/create-user')} className="button regresar-button">
                Regresar
            </button>
            <div className="header">
                <h2 style={{ display: 'inline', marginLeft: '270px' }}>Editar Usuario</h2>
            </div>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </td>
                            <td>
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Código Empleado"
                                    value={codigoEmpleado}
                                    onChange={(e) => setCodigoEmpleado(e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Posición"
                                    value={posicion}
                                    onChange={(e) => setPosicion(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit" className="button">Actualizar Usuario</button>
            </form>

            <h3>Asignación de Bots</h3>
            <table>
                <thead>
                    <tr>
                        <th>Seleccionar</th>
                        <th>Nombre Bot</th>
                        <th>Asignado</th>
                    </tr>
                </thead>
                <tbody>
                    {bots.map((bot) => (
                        <tr key={bot.bot_id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedBots.includes(bot.bot_id)}
                                    onChange={() => handleCheckboxChange(bot.bot_id)}
                                />
                            </td>
                            <td>{bot.bot_nombre}</td>
                            <td>{bot.isAssigned ? 'Asignado' : 'No asignado'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAssignBots} className="button">Asignar Bots Seleccionados</button>
            <button onClick={handleUnassignBots} className="button">Eliminar Asignaciones Seleccionadas</button>
        </div>
    );
};

export default EditUser;

