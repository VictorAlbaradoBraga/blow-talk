import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthForm = () => setIsLogin(!isLogin);

  return (
    <div className="auth-container">
      {isLogin ? <Login /> : <Register />}
      <p onClick={toggleAuthForm} className="toggle-link">
        {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Faça login"}
      </p>
    </div>
  );
}

export default Auth;
