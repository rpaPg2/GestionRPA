import React, { useEffect, useState } from 'react';
import './ListBots.css';

const ListBots = () => {
  const [bots, setBots] = useState([]);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bots-disponibles');
        const data = await response.json();
        setBots(data);
      } catch (error) {
        console.error('Error al obtener la lista de bots:', error);
      }
    };

    fetchBots();
  }, []);

  return (
    <div className="bot-list">
      <h1>RPA Disponibles</h1>
      <table>
        <thead>
          <tr>
            <th>ID Bot</th>
            <th>Nombre Bot</th>
            <th>ID Server</th>
            <th>Nombre Server</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.bot_id}>
              <td>{bot.bot_id}</td>
              <td>{bot.nombre_bot}</td>
              <td>{bot.server_id}</td>
              <td>{bot.nombre_server}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListBots;
