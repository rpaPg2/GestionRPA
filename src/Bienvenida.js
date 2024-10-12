import React from 'react';
import './App.css'; // Importa App.css ya que contiene los estilos

const Bienvenida = () => {
  const welcomeMessage = "GESTIÓN Y SEGUIMIENTO DE RPA";

  return (
    <header className="bienvenida-container">
      <video
        autoPlay
        loop
        muted
        className="background-video"
        aria-label="Video de fondo para gestión y seguimiento de RPA"
      >
        <source src={require('./assets/videos/Fondo1.mp4')} type="video/mp4" />
        <p>Su navegador no soporta la etiqueta de video.</p>
      </video>
      <h2 className="title-container animate-fade">{welcomeMessage}</h2>
    </header>
  );
};

export default Bienvenida;
