import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateUser.css';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Valor por defecto
  const [codigoEmpleado, setCodigoEmpleado] = useState('');
  const [nombre, setNombre] = useState('');
  const [posicion, setPosicion] = useState('');
  const [usuarios, setUsuarios] = useState([]); // Estado para los usuarios
  const [filter, setFilter] = useState(''); // Filtro de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [usersPerPage] = useState(10); // Usuarios por página

  const navigate = useNavigate(); // Hook para manejar la navegación

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir la recarga de la página

    try {
      // Enviar los datos a la API para crear el usuario
      await axios.post('http://localhost:5000/api/usuarios-crear', {
        username,
        password,
        role,
        codigoEmpleado,
        nombre,
        posicion,
      });

      // Limpiar el formulario y actualizar la lista de usuarios
      setUsername('');
      setPassword('');
      setRole('user');
      setCodigoEmpleado('');
      setNombre('');
      setPosicion('');
      fetchUsuarios(); // Cargar la lista de usuarios después de crear uno nuevo
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  // Función para cargar los usuarios desde la API
  const fetchUsuarios = async () => {
    try {
      // Usar la ruta de listar usuarios
      const response = await axios.get('http://localhost:5000/api/listar-tabla-user');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios por nombre de usuario o código de empleado
  const filteredUsers = usuarios.filter(user =>
    user.username.toLowerCase().includes(filter.toLowerCase()) ||
    user.codigo_empleado.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="create-user-container">
      <button 
        onClick={() => navigate('/admin/usuarios')} 
        className="button regresar-button"
      >
        Regresar
      </button>
      <div className="header">
        <h2 style={{ display: 'inline', marginLeft: '270px' }}>Crear Usuario</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              /></td>
              <td><input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              /></td>
              <td>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td><input
                type="text"
                placeholder="Código Empleado"
                value={codigoEmpleado}
                onChange={(e) => setCodigoEmpleado(e.target.value)}
                required
              /></td>
              <td><input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              /></td>
              <td><input
                type="text"
                placeholder="Posición"
                value={posicion}
                onChange={(e) => setPosicion(e.target.value)}
                required
              /></td>
              <td>
                <button type="submit" className="button create-user-button">Crear Usuario</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* Campo de búsqueda */}
      <div> <input
        type="text"
        style={{ width: '100%' }}
        placeholder="Buscar por Username o Código Empleado"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
        </div>
      {/* Listado de usuarios creados */}
      <h3>Usuarios Creados</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Id Usuario</th>
            <th>Código Empleado</th>
            <th>Nombre</th>
            <th>Posición</th>
            <th>Bots</th>
            <th>Edición</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.user_id}</td>
              <td>{user.codigo_empleado}</td>
              <td>{user.nombre}</td>
              <td>{user.posicion}</td>
              <td>{user.bots}</td>
              <td>
              <button onClick={() => navigate(`/edit-user?id=${user.id}`)}>Editar</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreateUser;

