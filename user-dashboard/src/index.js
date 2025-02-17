import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import bg from './assets/bg.jpeg';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div className="relative h-screen w-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
    {/* Logo positioned in the top-right corner */}
    <h1 className="absolute top-4 right-4 text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white">
      LEONI
    </h1>

    <App />
  </div>
);
