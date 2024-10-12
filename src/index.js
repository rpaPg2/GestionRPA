import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App'; // Cambiar a AppWrapper
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve AppWrapper con BrowserRouter */}
      <AppWrapper /> {/* Cambiado a AppWrapper */}
    </BrowserRouter>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
