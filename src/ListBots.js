import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './ListBots.css';

const ListBots = () => {
 
  const [bots, setBots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bots-disponibles`);
        const data = await response.json();
        setBots(data);
      } catch (error) {
        console.error('Error al obtener la lista de bots:', error);
      }
    };

    fetchBots();
  }, []);

  const indexOfLastBot = currentPage * itemsPerPage;
  const indexOfFirstBot = indexOfLastBot - itemsPerPage;
  const currentBots = bots.slice(indexOfFirstBot, indexOfLastBot);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(bots.length / itemsPerPage);

  return (
    
    <div className="bot-list">
       {/* Botón de Regresar */}
       <button onClick={() => navigate('/admin/usuarios')} className="back-button">
        Regresar
      </button>
      <h1>RPA Disponibles</h1>
      <table>
        <thead>
          <tr>
            <th>ID Bot Api</th>
            <th>Nombre Bot</th>
            <th>ID Server</th>
            <th>Nombre Server</th>
          </tr>
        </thead>
        <tbody>
          {currentBots.map((bot, index) => (
            <tr
              key={bot.bot_id}
              className={`animated-row ${hoveredRowIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
            >
              <td>{bot.id_Api}</td>
              <td>{bot.nombre_bot}</td>
              <td>{bot.server_id}</td>
              <td>{bot.nombre_server}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {hoveredRowIndex !== null && (
        <div className="tooltip">
          Fila: {hoveredRowIndex + 1} de {currentBots.length}
        </div>
      )}
     
    </div>
  );
};

export default ListBots;
