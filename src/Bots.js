import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importar ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos
import './Bots.css';

function Bots() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [bots, setBots] = useState([]);
  const userId = sessionStorage.getItem('userId');
  const user = localStorage.getItem('user');

  // Cargar datos desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedBots = JSON.parse(localStorage.getItem('bots')) || [];
    setBots(storedBots);
  }, []);

  // Guardar bots en localStorage cada vez que se actualicen
  useEffect(() => {
    localStorage.setItem('bots', JSON.stringify(bots));
  }, [bots]);

  useEffect(() => {
    const fetchBots = async () => {
      if (!userId) {
        console.error('User ID no está definido');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}api/bots?userId=${userId}`);
        console.log('Datos recibidos del backend:', response.data);
        
        // Aquí almacenamos los bots en el estado y en localStorage
        const botsWithDate = response.data.map(bot => ({
          ...bot,
          fechaEjecucion: localStorage.getItem(bot.nombreBot) || 'N/A' // Recuperar fecha de ejecución desde localStorage
        }));

        setBots(botsWithDate);
      } catch (error) {
        console.error('Error al obtener los bots asignados:', error);
      }
    };

    fetchBots();
  }, [userId]);

  const handleExecute = async (botId, idAAServer, idBotAA, nombreBot, servidor) => {
    console.log('Ejecutando bot con los siguientes datos:');
    console.log('Bot ID:', botId);
    console.log('ID de AAServer:', idAAServer);
    console.log('Nombre del Bot:', nombreBot);
    console.log('Servidor:', servidor);
    console.log('Nombre de Usuario:', user);

    try {
      const response = await axios.post(`${apiUrl}api/execute-bot`, {
        idAAServer,
        idBotAA,
        nombreBot,
        servidor,
        user
      });
      console.log('Respuesta de la ejecución del bot:', response.data);
      toast.success(`Bot "${nombreBot}" ejecutado exitosamente!`); // Usar toast para la notificación

      // Actualizar la fecha de ejecución del bot
      const updatedBots = bots.map((bot) =>
        bot.botId === botId ? { ...bot, fechaEjecucion: response.data.fechaEjecucion } : bot
      );

      setBots(updatedBots);

      // Guardar la fecha de ejecución en localStorage
      localStorage.setItem(nombreBot, response.data.fechaEjecucion);

    } catch (error) {
      console.error('Error al ejecutar el bot:', error);
      toast.error(`Error al ejecutar el bot "${nombreBot}", contactar con el equipo de soporte`); // Notificación de error
    }
  };

  return (
    <div className="table-container" style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>Bots Ejecutables</h1>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Bot Proceso</th>
            <th>Servidor de Ejecución</th>
            <th>Última Fecha de Ejecución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bots.length > 0 ? (
            bots.map((bot) => (
              <tr key={bot.botId}>
                <td>{bot.nombreBot}</td>
                <td>{bot.servidor}</td>
                <td>{bot.fechaEjecucion || 'N/A'}</td>
                <td>
                  <button onClick={() => handleExecute(bot.botId, bot.idAAServer, bot.idBotAA, bot.nombreBot, bot.servidor)}>Ejecutar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No hay bots asignados</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer /> {/* Agregar el contenedor de Toast */}
    </div>
  );
  
}

export default Bots;
