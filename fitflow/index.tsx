import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("FATAL RENDER ERROR:", e);
  rootElement.innerHTML = `<div style="color:white; padding:20px;">Ocorreu um erro fatal ao iniciar o app. Limpe o cache do navegador e tente novamente.</div>`;
}