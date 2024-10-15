import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importar ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos para los toast
import Modal from 'react-modal'; // Importar Modal
import './EditUser.css';

Modal.setAppElement('#root'); // Establecer el elemento raíz

const EditUser = () => {
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [codigoEmpleado, setCodigoEmpleado] = useState('');
    const [nombre, setNombre] = useState('');
    const [posicion, setPosicion] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
    const [bots, setBots] = useState([]); // Estado para los bots
    const [selectedBots, setSelectedBots] = useState([]); // Bots seleccionados para asignar/desasignar
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [isAssigning, setIsAssigning] = useState(true); // True si es asignar, false si es desasignar
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`gestion-rpa-backend.vercel.app/api/user-form-back?id=${userId}`);
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
                const response = await axios.get(`gestion-rpa-backend.vercel.app/api/user-bots-noy-asign?id=${userId}`);
                setBots(response.data.bots);
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

    const handleAssignBots = () => {
        if (selectedBots.length === 0) {
            toast.error('Por favor, selecciona al menos un bot para asignar.');
            return;
        }
        setIsAssigning(true); // Establecer modo de asignación
        setIsModalOpen(true); // Abrir el modal
    };

    const handleUnassignBots = () => {
        if (selectedBots.length === 0) {
            toast.error('Por favor, selecciona al menos un bot para desasignar.');
            return;
        }
        setIsAssigning(false); // Establecer modo de desasignación
        setIsModalOpen(true); // Abrir el modal
    };

    const confirmAction = async () => {
        setIsModalOpen(false); // Cerrar el modal

        const action = isAssigning ? 'assign-bots' : 'unassign-bots';
        const message = isAssigning ? 'Bots asignados correctamente' : 'Bots desasignados correctamente';

        try {
            await axios.post(`gestion-rpa-backend.vercel.app/api/${action}`, {
                userId,
                botIds: selectedBots,
            });
            toast.success(message); // Mostrar notificación de éxito
            setSelectedBots([]); // Limpiar selección de bots

            // Actualizar la lista de bots después de la acción
            const response = await axios.get(`gestion-rpa-backend.vercel.app/api/user-bots-noy-asign?id=${userId}`);
            setBots(response.data.bots);
        } catch (error) {
            console.error(`Error al ${action}:`, error);
            toast.error(`Error al ${action}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`gestion-rpa-backend.vercel.app/api/user-edit-update`, {
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
                    <tbody className='edit-user-form'>
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
                            <td>
                                <button type="submit" className="button">Actualizar Usuario</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <ToastContainer /> {/* Añadir ToastContainer para mostrar las notificaciones */}

            <h3>Asignación de Bots</h3>
            <div className='botones-assign-delete'>
                <td>
                    <button onClick={handleAssignBots} className="button-Assign">Asignar Bots Seleccionados</button>
                </td>
                <td>
                    <button onClick={handleUnassignBots} className="button-delete">Eliminar Asignaciones Seleccionadas</button>
                </td>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Seleccionar</th>
                        <th>Nombre Bot</th>
                        <th>Asignado/No Asignado</th>
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
                            <td className={bot.isAssigned ? 'assigned' : ''}>
                                {bot.isAssigned ? 'Asignado' : 'No asignado'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de Confirmación */}
          {/* Modal de Confirmación */}
<Modal
    isOpen={isModalOpen}
    onRequestClose={() => setIsModalOpen(false)}
    contentLabel="Confirmación"
    style={{
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '250px', // Ajustar el ancho de la ventana a 250px
            height: 'auto', // Ajustar la altura de la ventana automáticamente
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo con transparencia
            borderRadius: '8px', // Bordes redondeados
            padding: '15px', // Espaciado interno
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Sombra
        },
    }}
>
    <h2 style={{ fontSize: '14px', margin: '0', paddingBottom: '8px' }}>
        {isAssigning ? 'Asignar Bots' : 'Desasignar Bots'}
    </h2>
    <p style={{ fontSize: '12px' }}>
        ¿Estás seguro de que deseas {isAssigning ? 'asignar' : 'desasignar'} estos bots?
    </p>
    <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={confirmAction} className="button-confirmar">Confirmar</button>
        <button onClick={() => setIsModalOpen(false)} className="button-cancelar">Cancelar</button>
    </div>
</Modal>

        </div>
    );
};

export default EditUser;
