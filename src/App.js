import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./components/Auth"; // Componente que alterna entre Login e Register
import Chat from "./components/Chat";
import GroupChat from "./components/GroupChat";
import AdminPanel from "./components/AdminPanel";
import Home from "./components/Home"; // Página principal onde o usuário pode ver amigos e grupos

// Rota privada para proteger componentes acessíveis apenas após autenticação
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de autenticação (login/registro) */}
        <Route path="/" element={<Auth />} />

        {/* Página principal após login */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />

        {/* Rota para chat privado */}
        <Route path="/chat/:friendId" element={<PrivateRoute><Chat /></PrivateRoute>} />

        {/* Rota para chat em grupo */}
        <Route path="/group-chat/:groupId" element={<PrivateRoute><GroupChat /></PrivateRoute>} />

        {/* Painel administrativo */}
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
