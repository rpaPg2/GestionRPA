import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css'; // Importa el CSS

// Registrar todos los componentes de Chart.js necesarios
Chart.register(...registerables);

const Dashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [executionData, setExecutionData] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}api/ejecuciones-bot`) // Asegúrate de ajustar la ruta a tu API
      .then((response) => {
        setExecutionData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching execution data:', error);
      });
  }, []);

  // Verificar si los datos están cargados
  if (executionData.length === 0) {
    return <div>Cargando datos...</div>;
  }

// ================================
// 1. Ejecuciones por Usuario
// ================================
const executionsByUser = executionData.reduce((acc, exec) => {
  const user = exec.nombre_usuario;
  if (user) {
    acc[user] = (acc[user] || 0) + 1;
  }
  return acc;
}, {});

// Convertir el objeto a un array y ordenar por el número de ejecuciones
const sortedUsers = Object.entries(executionsByUser)
  .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor
  .slice(0, 10); // Tomar los primeros 10

// Extraer nombres y datos
const userNames = sortedUsers.map(([name]) => name);
const userExecutionCounts = sortedUsers.map(([, count]) => count);

const userExecData = {
  labels: userNames,
  datasets: [{
    label: 'Ejecuciones por Usuario',
    data: userExecutionCounts,
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
    hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
    hoverBorderColor: 'rgba(255, 255, 255, 1)',
  }],
};


  // ================================
  // 2. Ejecuciones por Servidor
  // ================================
  const executionsByServer = executionData.reduce((acc, exec) => {
    const server = exec.nombre_servidor;
    if (server) {
      acc[server] = (acc[server] || 0) + 1;
    }
    return acc;
  }, {});

  const serverExecData = {
    labels: Object.keys(executionsByServer),
    datasets: [{
      label: 'Ejecuciones por Servidor',
      data: Object.values(executionsByServer),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      hoverBackgroundColor: 'rgba(153, 102, 255, 1)',
      hoverBorderColor: 'rgba(255, 255, 255, 1)',
    }],
  };

  // ================================
  // 3. Ejecuciones por Mes
  // ================================
  const executionsByMonth = executionData.reduce((acc, exec) => {
    const dateField = exec.Fecha_ejecucion; // Asegúrate de que este sea el nombre correcto del campo de fecha
    if (dateField && typeof dateField === 'string') {
      const dateParts = dateField.split('.'); // Dividir la fecha "dd.mm.yyyy"
      const month = parseInt(dateParts[1]); // Extraer el mes (índice 1)
      if (!isNaN(month)) {
        acc[month - 1] = (acc[month - 1] || 0) + 1; // Restar 1 porque los índices del array van de 0 a 11
      }
    }
    return acc;
  }, {});

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const executionCountsByMonth = months.map((_, i) => executionsByMonth[i] || 0);

  const datesExecData = {
    labels: months,
    datasets: [{
      label: 'Ejecuciones por Mes',
      data: executionCountsByMonth,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
      hoverBorderColor: 'rgba(255, 255, 255, 1)',
    }],
  };

  // ================================
  // 4. Top 3 Robots más Ejecutados
  // ================================
  const executionsByBot = executionData.reduce((acc, exec) => {
    const botName = exec.nombre_bot;
    if (botName) {
      acc[botName] = (acc[botName] || 0) + 1;
    }
    return acc;
  }, {});

  const topBots = Object.entries(executionsByBot)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const botNames = topBots.map(([name]) => name);
  const botExecutionCounts = topBots.map(([, count]) => count);

  const topBotsData = {
    labels: botNames,
    datasets: [{
      data: botExecutionCounts,
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
      ],
      hoverBackgroundColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      hoverBorderColor: 'rgba(255, 255, 255, 1)',
    }],
  };

  // Opciones para el gráfico circular
  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // ================================
  // Renderizar las gráficas
  // ================================
  return (
    <div className="dashboard">
      <h1>Dashboard de Ejecuciones de Bots</h1>
      <div className="chart-container">

        {/* Gráfico de Ejecuciones por Usuario */}
        <div className="chart">
          <h2>Ejecuciones por Usuario</h2>
          <Bar data={userExecData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Gráfico de Ejecuciones por Servidor */}
        <div className="chart">
          <h2>Ejecuciones por Servidor</h2>
          <Bar data={serverExecData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Gráfico de Ejecuciones por Mes */}
        <div className="chart">
          <h2>Ejecuciones por Mes</h2>
          <Line data={datesExecData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Gráfico de Top 3 Robots más Ejecutados */}
        <div className="chart">
          <h2>Top 3 Robots más Ejecutados</h2>
          <Doughnut data={topBotsData} options={{ ...doughnutOptions, maintainAspectRatio: false }} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
