import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Função para resetar os dados em caso de crash total
const handleHardReset = () => {
    try {
        localStorage.removeItem('fitflow_state_v2');
        window.location.reload();
    } catch (e) {
        alert('Não foi possível limpar os dados. Tente limpar o cache do navegador manualmente.');
    }
};

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("FATAL RENDER ERROR:", e);
  // Renderiza uma UI de fallback manual caso o React falhe completamente
  rootElement.innerHTML = `
    <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        background-color: #0a0a0a; 
        color: white; 
        font-family: sans-serif; 
        text-align: center;
        padding: 20px;
    ">
        <h2 style="font-size: 1.5rem; margin-bottom: 10px; color: #f97316;">Ops! Algo deu errado.</h2>
        <p style="color: #a3a3a3; margin-bottom: 30px;">Ocorreu um erro inesperado ao carregar o aplicativo.</p>
        <button id="reset-btn" style="
            background-color: #f97316; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: pointer;
            font-size: 1rem;
        ">
            Limpar Dados e Reiniciar
        </button>
    </div>
  `;
  
  // Adiciona o listener ao botão criado manualmente
  const btn = document.getElementById('reset-btn');
  if (btn) btn.onclick = handleHardReset;
}