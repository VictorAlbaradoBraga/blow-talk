import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { encryptMessage, decryptMessage } from "../utils/crypto";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      console.log("Enviando dados:", { username, password }); // Depuração

      const response = await axios.post("http://localhost:3000/register", {
        username,
        password,
      });

      if (response.status === 201) {
        alert("Cadastro realizado com sucesso!");
        const symmetricKey = response.data.symmetricKey;
        const encryptedSymmetricKey = encryptMessage(symmetricKey, password);
        localStorage.setItem("encryptedSymmetricKey", encryptedSymmetricKey);

        const decryptedKey = decryptMessage(encryptedSymmetricKey, password);
        const encryptedMessage = encryptMessage("Mensagem Secreta", decryptedKey);
        console.log("Mensagem criptografada:", encryptedMessage);

        navigate("/");
      } else {
        alert("Erro ao realizar o cadastro");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      if (error.response) {
        console.error("Resposta do servidor:", error.response.data);
      }
      alert("Erro ao cadastrar");
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Cadastrar</button>
    </div>
  );
}

export default Register;
